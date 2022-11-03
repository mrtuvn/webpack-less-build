define([
    'jquery',
    'mage/utils/wrapper',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/action/select-billing-address'
], function (
    $,
    wrapper,
    quote,
    selectBillingAddress
) {
    'use strict';

    return function (checkoutDataResolver) {
        checkoutDataResolver.applyBillingAddress = wrapper.wrapSuper(checkoutDataResolver.applyBillingAddress, function (code, scrollToElementId) {
            if (!quote.billingAddress()) {
                this._super(code, scrollToElementId);
                return;
            }

            selectBillingAddress(quote.billingAddress());
        });

        return checkoutDataResolver;
    };
});