define([
    'jquery',
    'mage/utils/wrapper',
    'underscore',
    'Amasty_Conditions/js/model/resource-url-manager',
    'Magento_Checkout/js/model/quote',
    'mage/storage',
    'Magento_Checkout/js/model/totals',
    'Magento_Checkout/js/model/error-processor',
    'Magento_Customer/js/customer-data',
    'uiRegistry',
    'Amasty_Conditions/js/model/subscriber',
    'Lg_ShippingMethod/js/view/shipping/loadTotals'
], function ($, wrapper, _, resourceUrlManager, quote, storage, totalsService, errorProcessor, customerData, registry, subscriber, shippingTotal) {
    'use strict';

    var ajax,
        sendTimeout,
        sendingPayload;

    return function (force) {
        var serviceUrl,
            payload,
            address,
            paymentMethod,
            requiredFields = ['countryId', 'region', 'regionId', 'postcode'],
            newAddress = quote.shippingAddress() ? quote.shippingAddress() : quote.billingAddress(),
            city;

        serviceUrl = resourceUrlManager.getUrlForTotalsEstimationForNewAddress(quote);
        address = _.pick(newAddress, requiredFields);
        paymentMethod = quote.paymentMethod() ? quote.paymentMethod().method : null;
        city = quote.shippingAddress() ? quote.shippingAddress().city : null;

        address.extension_attributes = {
            advanced_conditions: {
                custom_attributes: quote.shippingAddress() ? quote.shippingAddress().custom_attributes : [],
                payment_method: paymentMethod,
                city: city,
                shipping_address_line: quote.shippingAddress() ? quote.shippingAddress().street : null,
                billing_address_country: quote.billingAddress() ? quote.billingAddress().countryId : null
            }
        };

        payload = {
            addressInformation: {
                address: address
            }
        };

        if (quote.shippingMethod() && quote.shippingMethod()['method_code']) {
            payload.addressInformation['shipping_method_code'] = quote.shippingMethod()['method_code'];
            payload.addressInformation['shipping_carrier_code'] = quote.shippingMethod()['carrier_code'];
        }

        if (!_.isEqual(sendingPayload, payload) || force === true) {
            sendingPayload = payload;
            clearTimeout(sendTimeout);
            //delay for avoid multi request
            sendTimeout = setTimeout(function(){
                clearTimeout(sendTimeout);
                if (subscriber.isLoading() === true) {
                    ajax.abort();
                } else {
                    // Start loader for totals block
                    totalsService.isLoading(true);
                    subscriber.isLoading(true);
                }

                ajax = storage.post(
                    serviceUrl,
                    JSON.stringify(payload),
                    false
                ).done(function (result) {
                    quote.setTotals(result);
                    shippingTotal.showShippingCost();
                    // Stop loader for totals block
                    totalsService.isLoading(false);
                    subscriber.isLoading(false);
                }).fail(function (response) {
                    if (response.responseText || response.status) {
                        errorProcessor.process(response);
                    }
                });
            }, 200);
        }
    };
});