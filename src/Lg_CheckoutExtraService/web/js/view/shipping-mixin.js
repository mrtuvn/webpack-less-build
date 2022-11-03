define([
    'mage/translate'
], function (
    $t
) {
    'use strict';

    let mixin = {
        showShippingAddressNote: function () {
            if (window.checkoutConfig.isExpendBillingOptions === null ||
                window.checkoutConfig.isExpendBillingOptions === undefined ||
                !window.checkoutConfig.isExpendBillingOptions) {
                return false;
            }
            return true;
        },

        getShippingAddressNote: function () {
            return $t('Delivery is only available within %1');
        },

        isOnlyEw: function () {
            let isOnlyEw = true;
            let itemsData = window.checkoutConfig.quoteItemData;
            itemsData.forEach(function (item) {
                if (item.product.erp_type != 'ew') {
                    if (isOnlyEw != false) {
                        isOnlyEw = false;
                    }
                }
            });

            return isOnlyEw;
        }
    };

    return function (target) {
        return target.extend(mixin);
    };
});