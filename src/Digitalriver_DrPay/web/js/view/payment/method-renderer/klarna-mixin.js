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

        var mixin = {
            placeOrder: function () {
                this.saveQuoteDr();
                return false;
            },

            saveQuoteDr: function () {

                var self = this;
                if(typeof klarnaDigitalRiverJs != "undefined") {

                    $.ajax({
                        type: 'POST',
                        url: BASE_URL + 'drpay/klarna/savedrquote',
                        showLoader: true, //use for display loader
                        success: function (response) {
                            let $message = $('#klarna-message');
                            if (response.success && response.content.payload) {
                                $('body').trigger('processStart');
                                klarnaDigitalRiverJs.createSource(response.content.payload).then(function (result) {
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
                                        window.checkoutConfig.payment.drpay_klarna.redirect_url = source.redirect.redirectUrl;

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
            }
        };

        return function (target) {
            return target.extend(mixin);
        };
    }
);
