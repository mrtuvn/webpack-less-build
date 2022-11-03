/*jshint browser:true jquery:true*/
/*global alert*/
define([
    'jquery',
    'mage/utils/wrapper',
    'Magento_Checkout/js/model/quote',
    'mage/url',
    'Magento_Checkout/js/model/full-screen-loader',
    'mage/storage',
    'Magento_Checkout/js/model/error-processor',
    'Magento_Checkout/js/model/url-builder',
    'Magento_Checkout/js/action/get-payment-information',
    'Magento_Customer/js/model/customer'
], function ($, wrapper, quote, urlBuilder, fullScreenLoader, storage, errorProcessor, checkoutUrl, getPaymentInformationAction, customer) {
    'use strict';

    return function (setBillingAddressAction) {
        return wrapper.wrap(setBillingAddressAction, function (originalAction, messageContainer) {

            if (quote.paymentMethod() && quote.paymentMethod().method === "cybersourceklarna") {
                if (quote.billingAddress() != null) {
                    var serviceUrl,
                    payload;
                    if (!customer.isLoggedIn()) {
                        serviceUrl = checkoutUrl.createUrl('/guest-carts/:cartId/billing-address', {
                            cartId: quote.getQuoteId()
                        });
                        payload = {
                            cartId: quote.getQuoteId(),
                            address: quote.billingAddress()
                        };
                    } else {
                        serviceUrl = checkoutUrl.createUrl('/carts/mine/billing-address', {});
                        payload = {
                            cartId: quote.getQuoteId(),
                            address: quote.billingAddress()
                        };
                    }

                    fullScreenLoader.startLoader();

                    return storage.post(
                        serviceUrl, JSON.stringify(payload)
                    ).done(
                        function () {
                            var deferred = $.Deferred();

                            getPaymentInformationAction(deferred);
                            $.when(deferred).done(function () {
                                var stopScreenLoader = fullScreenLoader;
                                $.ajax({
                                    method: 'GET',
                                    url: urlBuilder.build("cybersourceklarna/index/gettoken"),
                                    data: {
                                        'guestEmail': quote.guestEmail,
                                        'updateToken': 1
                                    }
                                }).done(function (data){
                                    var processorToken = data.processorToken;
                                    stopScreenLoader.stopLoader();
                                    if (processorToken === "" || processorToken === null) {
                                        $("#visible_agreement_accepted").html(
                                            "<span>" + $.mage.__("Klarna widget loading error. Please try again.") + "</span>"
                                        );
                                        return false;
                                    }
                                    else {
                                        if ($("#klarna_container").length < 1) {
                                            location.reload();
                                            return false;
                                        }
                                    }

                                    Klarna.Credit.init(
                                        {
                                            client_token: processorToken
                                        }
                                    );

                                    Klarna.Credit.load({container: "#klarna_container"});
                                });
                            });
                        }
                    ).fail(
                        function (response) {
                            errorProcessor.process(response, messageContainer);
                            fullScreenLoader.stopLoader();
                        }
                    );
                }
            }
            else {
                return originalAction(messageContainer);
            }
        });
    };
});
