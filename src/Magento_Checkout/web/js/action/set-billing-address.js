/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
define(
    [
        'jquery',
        'Magento_Checkout/js/model/quote',
        'Magento_Checkout/js/model/url-builder',
        'mage/storage',
        'Magento_Checkout/js/model/error-processor',
        'Magento_Customer/js/model/customer',
        'Magento_Checkout/js/model/full-screen-loader',
        'Magento_Checkout/js/action/get-payment-information',
        'Lg_ShippingMethod/js/view/shipping/loadTotals'
    ],
    function ($,
              quote,
              urlBuilder,
              storage,
              errorProcessor,
              customer,
              fullScreenLoader,
              getPaymentInformationAction,
              shippingTotal
    ) {
        'use strict';

        return function (messageContainer) {
            var serviceUrl,
                payload;

            /**
             * Checkout for guest and registered customer.
             */
            if (customer.isLoggedIn()) {
                serviceUrl = urlBuilder.createUrl('/carts/mine/billing-address', {});
                payload = {
                    cartId: quote.getQuoteId(),
                    address: quote.billingAddress()
                };
            } else {
                serviceUrl = urlBuilder.createUrl('/guest-carts/:cartId/billing-address', {
                    cartId: quote.getQuoteId()
                });
                payload = {
                    cartId: quote.getQuoteId(),
                    address: quote.billingAddress()
                };

            }
            if (quote.billingAddress() === null) {
                return;
            }

            return storage.post(
                serviceUrl, JSON.stringify(payload)
            ).done(
                function () {
                    var deferred = $.Deferred();

                    getPaymentInformationAction(deferred);
                    $.when(deferred).done(function () {
                        shippingTotal.showShippingCost();
                    });
                }
            ).fail(
                function (response) {
                    errorProcessor.process(response, messageContainer);
                }
            );
        };
    }
);
