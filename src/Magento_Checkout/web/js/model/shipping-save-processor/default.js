/*
* Overrided
*
* match billing address with shipping if canUseForBilling ("billing address and shipping address are the same" option)
* (ignore if billing address is already populated)
*
* */
define([
    'ko',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/model/resource-url-manager',
    'mage/storage',
    'Magento_Checkout/js/model/payment-service',
    'Magento_Checkout/js/model/payment/method-converter',
    'Magento_Checkout/js/model/error-processor',
    'Magento_Checkout/js/model/full-screen-loader',
    'Magento_Checkout/js/action/select-billing-address',
    'Magento_Checkout/js/model/shipping-save-processor/payload-extender',
    'Magento_Ui/js/model/messageList',
    'jquery',
    'mage/url',
    'Magento_Checkout/js/model/cart/totals-processor/default',
    'Magento_Checkout/js/model/cart/cache',
    'Lg_ShippingMethod/js/view/shipping/loadTotals'
], function (
    ko,
    quote,
    resourceUrlManager,
    storage,
    paymentService,
    methodConverter,
    errorProcessor,
    fullScreenLoader,
    selectBillingAddressAction,
    payloadExtender,
    globalMessages,
    $,
    urlBuilder,
    defaultTotal,
    cartCache,
    shippingTotal
) {
    'use strict';

    return {
        /**
         * @return {jQuery.Deferred}
         */
        saveShippingInformation: function () {
            var payload, self = this;
            $('h2.step-title:gt(0)').off("click"); // clean toggle event for step-title
            if (quote.shippingAddress().canUseForBilling()) {
                selectBillingAddressAction(quote.shippingAddress());
            }

            payload = {
                addressInformation: {
                    'shipping_address': quote.shippingAddress(),
                    'billing_address': quote.billingAddress(),
                    'shipping_method_code': quote.shippingMethod()['method_code'],
                    'shipping_carrier_code': quote.shippingMethod()['carrier_code']
                }
            };

            payloadExtender(payload);

            fullScreenLoader.startLoader();

            return storage.post(
                resourceUrlManager.getUrlForSetShippingInformation(quote),
                JSON.stringify(payload)
            ).done(
                function (response) {
                    quote.setTotals(response.totals);
                    paymentService.setPaymentMethods(methodConverter(response['payment_methods']));
                    $('.section-container').removeClass("active");
                    $('li#shipping').hide();
                    if (quote.extension_attributes && window.checkoutConfig.showShippingInCartSummary) {
                        shippingTotal.showShippingCost();
                    }
                    checkout2Page();
                    window.scrollTo(0, 0);
                    fullScreenLoader.stopLoader();
                }
            ).fail(
                function (response) {
                    window.location.reload();
                    globalMessages.addErrorMessage({message: 'Sorry, this product is not available.'});
                    // Reload cart with updated price
                    cartCache.set('totals', null);
                    defaultTotal.estimateTotals();
                    fullScreenLoader.stopLoader();
                }
            )
        }
    };
});
