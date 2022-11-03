/**
 *
 * @category Digitalriver
 * @package  Digitalriver_DrPay
 */
/*browser:true*/

define([
        'jquery',
        'underscore',
        'Magento_Checkout/js/view/payment/default',
        'Magento_Paypal/js/action/set-payment-method',
        'Magento_Checkout/js/model/quote',
        'mage/translate'
    ], function (
    $,
    _,
    Component,
    setPaymentMethodAction,
    quote,
    $t
    ) {
        'use strict';

        return Component.extend(
            {
                defaults: {
                    template: 'Digitalriver_DrPay/payment/paypal',
                    code: 'drpay_paypal'
                },
                redirectAfterPlaceOrder: false,
                /**
                 * Redirect to custom controller for payment
                 */
                afterPlaceOrder: function () {
                    return false;
                },
                /**
                 * Get payment name
                 *
                 * @returns {String}
                 */
                getCode: function () {
                    return this.code;
                },

                /**
                 * Get payment description
                 *
                 * @returns {String}
                 */
                getInstructions: function () {
                    return window.checkoutConfig.payment.instructions[this.getCode()];
                },

                /**
                 * Get payment title
                 *
                 * @returns {String}
                 */
                getTitle: function () {
                    return window.checkoutConfig.payment[this.getCode()].title;
                },

                /**
                 * Get Digitalriver js url
                 *
                 * @returns {String}
                 */
                getJsUrl: function () {
                    return window.checkoutConfig.payment[this.getCode()].js_url;
                },
                /**
                 * Get Digitalrive public key
                 *
                 * @returns {String}
                 */
                getPublicKey: function () {
                    return window.checkoutConfig.payment[this.getCode()].public_key;
                },

                /**
                 * Check if payment is active
                 *
                 * @returns {Boolean}
                 */
                isActive: function () {
                    var active = this.getCode() === this.isChecked();

                    this.active(active);

                    return active;
                },
                verifyVAT: function () {
                    var vat_id = $("#vat_id_paypal").val();
                    var url = BASE_URL + 'drpay/vat/verifyvat';
                    console.log(url);
                    $.ajax({
                        type: 'POST',
                        url: url,
                        dataType: 'json',
                        data: {
                            "taxIdentifiers":
                                {
                                    "vat_id": vat_id,
                                },

                        },
                        showLoader: true, //use for display loader
                        success:
                            function (response) {
                                response = JSON.parse(response);
                                console.log(response);
                                if (response.errors) {
                                    document.getElementById("vat-message-paypal").innerHTML = "Register VAT Fail!";
                                } else {
                                    document.getElementById("vat-message-paypal").innerHTML = "Register VAT Successfully!";
                                }
                            }
                    })
                    ;
                },
                radioInit: function () {
                    $(".payment-methods input:radio:first").prop("checked", true).trigger("click");
                },
                /** Redirect to paypal */
                continueToPayPal: function () {
                    this.saveQuoteDr();

                    return false;
                },

                placeOrder: function () {

                    this.saveQuoteDr();

                    return false;
                },


                saveQuoteDr: function () {

                    var self = this;
                    if (typeof paypalDigitalRiverJs != "undefined") {

                        $.ajax({
                            type: 'POST',
                            url: BASE_URL + 'drpay/paypal/savedrquote',
                            showLoader: true, //use for display loader
                            success: function (response) {
                                let $message = $('#paypal-message');
                                console.log(response);
                                if (response.success && response.content.payload) {
                                    $('body').trigger('processStart');
                                    paypalDigitalRiverJs.createSource(response.content.payload).then(function (result) {
                                        if (result.error) {
                                            let errors = result.error.errors;
                                            //Something went wrong, display the error message to the customer
                                            $($message).empty();
                                            if (errors.length > 0) {
                                                $.each(errors, function (key, value) {
                                                    if (value.message) {
                                                        $($message).append('<div>' + value.message + '</div>');
                                                    }
                                                });
                                            } else {
                                                $($message).append($t('Unable to process'));
                                            }
                                            $('body').trigger('processStop');
                                        } else {
                                            var source = result.source;
                                            window.checkoutConfig.payment.drpay_paypal.redirect_url = source.redirect.redirectUrl;
                                            var selectedShippingMethod = '';
                                            if (quote.shippingMethod() && quote.shippingMethod()['carrier_title']) {
                                                selectedShippingMethod = quote.shippingMethod()['carrier_title'];
                                            }
                                            checkout3Page(selectedShippingMethod, self.getTitle());
                                            setPaymentMethodAction(self.messageContainer).done(
                                                function () {
                                                    self.createOrderInMagento();
                                                }
                                            );
                                            $('body').trigger('processStop');
                                        }
                                    });
                                } else {
                                    $($message).empty();

                                    let errors = response.content.error;

                                    $($message).empty();

                                    if (typeof errors === 'string') {
                                        errors = [errors];
                                    }

                                    $.each(errors, function (key, value) {
                                        if (value.description) {
                                            $($message).append('<div>' + value.description + '</div>');
                                        } else {
                                            $($message).append('<div>' + value + '</div>');
                                        }
                                    });
                                }
                            },
                        });
                    }
                },


                saveVatToBillingAddress: function () {

                    var is_company = "individual";
                    var vat_id = '';
                    var company_name = '';

                    if ($('#company_checkbox').hasClass('checked')) {
                        is_company = "company";
                        vat_id = $("#vat_id").val();
                        company_name = $("#company_name").val().trim();
                    }

                    var self = this;
                    var url = BASE_URL + 'drpay/verifyvat/savevattobillingaddress';
                    $.ajax({
                        type: 'POST',
                        url: url,
                        dataType: 'json',
                        data: {
                            "companyInformation":
                                {
                                    "vat_id": vat_id,
                                    "company_name": company_name,
                                    "is_company": is_company
                                },

                        },
                        showLoader: true, //use for display loader
                        success:
                            function (response) {

                                var selectedShippingMethod = '';
                                if (quote.shippingMethod() && quote.shippingMethod()['carrier_title']) {
                                    selectedShippingMethod = quote.shippingMethod()['carrier_title'];
                                }
                                checkout3Page(selectedShippingMethod, self.getTitle());
                                setPaymentMethodAction(self.messageContainer).done(
                                    function () {
                                        self.createOrderInMagento();
                                    }
                                );

                            }
                    })
                    ;
                },
                createOrderInMagento: function () {
                    var methodData = window.checkoutConfig.payment.drpay_paypal;
                    $.mage.redirect(BASE_URL + 'drpay/payment/start?nextUrl=' + methodData.redirect_url + '&sourceId=' + methodData.source_id);
                }

            }
        );
    }
);
