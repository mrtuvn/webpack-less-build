define([
    'jquery',
    'uiComponent',
    'ko',
    'Magento_Customer/js/customer-data',
    'jquery/jquery-storageapi'
    ], function ($, Component, ko, customerData) {
        'use strict';

        var cacheKey = 'cart',

            /**
             * @return {*}
             */
            getData = function () {
                var data = customerData.get(cacheKey)();

                if ($.isEmptyObject(data)) {
                    data = $.initNamespaceStorage('mage-cache-storage').localStorage;
                    if ($.isEmptyObject(data)) {
                        data = initData();
                        saveData(data);
                    }
                }

                return data;
            };

        return Component.extend({
            defaults: {
                template: 'Magento_Checkout/products-number'
            },

            initialize: function () {
                this._super();

                var self = this,
                    cartData = customerData.get('cart');

                this.isVisible(false);
                this.prodNumber = ko.observable('');

                cartData.subscribe(function (updatedCart) {
                    self.getProductsNumber(updatedCart);
                });
                this.getProductsNumber(cartData());
            },

            getProductsNumber: function(updatedCart) {
                this.prodNumber(updatedCart.summary_count);
                this.isVisible(true);
            },

            isVisible: function(visibleState) {
                return visibleState;
            }
        });
    }
);