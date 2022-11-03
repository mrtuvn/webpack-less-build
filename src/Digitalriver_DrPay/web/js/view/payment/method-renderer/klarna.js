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
        'Magento_Checkout/js/model/quote'
    ], function (
    $,
    _,
    Component,
    setPaymentMethodAction,
    quote
    ) {
        'use strict';

        return Component.extend(
            {
                defaults: {
                    template: 'Digitalriver_DrPay/payment/klarna',
                    code: 'drpay_klarna'
                },
                redirectAfterPlaceOrder: false,
                /**
                 * Redirect to custom controller for payment
                 */
                afterPlaceOrder: function () {
                    $.mage.redirect(window.checkoutConfig.payment.drpay_klarna.redirect_url);
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

                    var vat_id = $("#vat_id_klarna").val();

                    var url = BASE_URL + 'drpay/vat/verifyvat';
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
                                if (response.errors) {
                                    document.getElementById("vat-message-klarna").innerHTML = "Register VAT Fail!";
                                } else {
                                    document.getElementById("vat-message-klarna").innerHTML = "Register VAT Successfully!";
                                }
                            }
                    })
                    ;
                },
                radioInit: function () {
                    $(".payment-methods input:radio:first").prop("checked", true).trigger("click");
                },
                placeOrder: function () {
                    this.saveVatToBillingAddress();

                    return false;
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
                    var methodData = window.checkoutConfig.payment.drpay_klarna;
                    $.mage.redirect(BASE_URL + 'drpay/payment/start?nextUrl=' + methodData.redirect_url);
                }

            }
        );
    }
);
