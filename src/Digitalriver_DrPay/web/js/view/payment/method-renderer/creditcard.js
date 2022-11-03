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
        'Magento_Customer/js/model/customer',
        'mage/translate'
    ], function (
    $,
    _,
    Component,
    setPaymentMethodAction,
    quote,
    customer,
    $t
    ) {
        'use strict';

        return Component.extend(
            {
                defaults: {
                    template: 'Digitalriver_DrPay/payment/creditcard',
                    code: 'drpay_creditcard'
                },
                redirectAfterPlaceOrder: false,
                /** Redirect to custom controller for payment */
                afterPlaceOrder: function () {
                    // $.mage.redirect(window.checkoutConfig.payment.drpay_creditcard.redirect_url);
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
                placeOrder: function () {
                    this.saveQuoteDr();

                    return false;
                },


                getCreditCardSourceId: function (payload) {
                    if(typeof creditCardDigitalRiverJs != "undefined") {
                        var self = this;
                        $('body').trigger('processStart');
                        creditCardDigitalRiverJs.createSource(creditCardNumber, payload).then(function (result) {
                            if (result.error) {
                                $("#creditcard-message").text("");
                                $("#creditcard-message").text($t('Unable to process'));
                                $('body').trigger('processStop');
                            } else {
                                //Success!  You can now send the token to your server for use in downstream API calls.
                                var source = result.source;
                                window.checkoutConfig.payment.drpay_creditcard.redirect_url = BASE_URL + 'drpay/payment/success';
                                if (source.id) {
                                    $.ajax({
                                        type: 'POST',
                                        url: BASE_URL + 'drpay/creditcard/savedrsource',
                                        data: {"source_id": source.id},
                                        showLoader: true, //use for display loader
                                        success: function (response) {
                                            if (response.success) {
                                                $("#creditcard-message").empty();
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
                                            } else {
                                                $("#creditcard-message").text("");
                                                $("#creditcard-message").text($t('Unable to process'));
                                            }
                                        }
                                    });
                                }
                                $('body').trigger('processStop');
                            }
                        });
                    } else {
                        console.error("creditCardDigitalRiverJs is not available cannot place order now.");
                    }
                },

                saveQuoteDr: function () {
                    var self = this;

                    $.ajax({
                        type: 'POST',
                        showLoader: true, //use for display loader
                        url: BASE_URL + 'drpay/creditcard/savedrquote',
                        success: function (response) {
                            let $message = $('#creditcard-message');
                            if (response.success && response.content.payload) {
                                //once cart created get the payment source id
                                self.getCreditCardSourceId(response.content.payload);
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
                        }
                    });
                },

                verifyVAT: function () {
                    var vat_id = $("#vat_id").val();

                    var url = BASE_URL + 'drpay/vat/verifyvat';
                    console.log(url);
                    $.ajax({
                        type: 'POST',
                        url: url,
                        dataType: 'json',
                        data: {
                            "taxIdentifiers":
                                {
                                    //   "type": country_id,
                                    "vat_id": vat_id,
                                    //     "customerId": external_reference_id
                                },

                        },
                        showLoader: true, //use for display loader
                        success:
                            function (response) {
                                response = JSON.parse(response);
                                console.log(response);
                                if (response.errors) {
                                    // ("vat-message").text("Register VAT Fail!");
                                    document.getElementById("vat-message").innerHTML = "Register VAT Fail!";
                                } else {
                                    // $("vat-message").text("Register VAT Successfully")
                                    document.getElementById("vat-message").innerHTML = "Register VAT Successfully!";
                                }
                            }
                    })
                    ;
                },
                radioInit: function () {
                    $(".payment-methods input:radio:first").prop("checked", true).trigger("click");
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
                    var methodData = window.checkoutConfig.payment.drpay_creditcard;
                    $.mage.redirect(BASE_URL + 'drpay/payment/start?nextUrl=' + methodData.redirect_url);
                }

            }
        );
    }
)
;
