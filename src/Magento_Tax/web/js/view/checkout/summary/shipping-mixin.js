define([
        'jquery',
        'Magento_Checkout/js/model/quote'
    ], function ($, quote) {
        'use strict';
        let mixin = {
            /**
             * @return {*}
             */
            getValue: function () {
                if (!this.isCalculated()) {
                    return this.notCalculatedMessage;
                }
                var self = this;
                var items = quote.getItems();
                var totalPrice = 0;
                $.each(items, function (i, item) {
                    if (typeof item.shippingRates === 'function') {
                        let itemId = item.item_id;
                        let itemSelect = {};
                        if (quote.extension_attributes !== undefined && quote.extension_attributes.shipping_method_shipping_selections !== undefined && quote.extension_attributes.shipping_method_shipping_selections[itemId] !== undefined) {
                            itemSelect[itemId] = quote.extension_attributes.shipping_method_shipping_selections[itemId].carrier_value;
                            let arr = itemSelect[itemId].split('_');
                            let shippingCostId = arr[1].split('-')[1];
                            let price = self.getPriceByCostId(shippingCostId, itemId, item.shippingRates());
                            let shippingTaxPrice = self.getShippingPriceTaxByCostId(shippingCostId, itemId, item.shippingRates());

                            if (price !== null && price !== undefined) {
                                totalPrice += parseFloat(price);
                            }
                            if (shippingTaxPrice !== null && shippingTaxPrice !== undefined) {
                                totalPrice += parseFloat(shippingTaxPrice);
                            }
                        } else {
                            if (typeof item.shippingRates()[0] !== 'undefined') {
                                totalPrice += parseFloat(item.shippingRates()[0].cost);
                            }
                        }
                        item.index = i + 1;
                    }
                });

                return this.getFormattedPrice(totalPrice);
            },

            getIncludingValue: function () {
                return this.getValue();
            },

            getPriceByCostId: function (costId, itemId, rates) {
                var price = null;
                rates.forEach(function (rate) {
                    if (rate.cost_id === costId && rate.item_id === itemId) {
                        price = rate.cost;
                    }
                });
                return price;
            },

            getShippingPriceTaxByCostId: function (costId, itemId, rates) {
                var shippingTaxPrice = null;
                rates.forEach(function (rate) {
                    if (rate.cost_id === costId) {
                        shippingTaxPrice = rate.shippingTaxPrice;
                    }
                });
                return shippingTaxPrice;
            },

            /**
             * @returns {boolean}
             */
            canShowShippingInSummary: function () {
                let canShowShippingInSummary = true;
                if (window.hasOwnProperty('checkoutConfig') && window.checkoutConfig.hasOwnProperty('showShippingInCartSummary')) {
                    canShowShippingInSummary = window.checkoutConfig.showShippingInCartSummary;
                }
                return canShowShippingInSummary;
            }
        }

        $(document).ready(function () {
            $(document).on('click', '.totals.shipping.excl', function() {
                if ($('.totals.shipping.excl').hasClass('close')) {
                    $('.totals.shipping.item').show();
                    $('.totals.shipping.excl').removeClass('close');
                    $('.totals.shipping.excl').addClass('open');
                    $('.totals.shipping.excl').addClass('expanded');
                } else {
                    $('.totals.shipping.item').hide();
                    $('.totals.shipping.excl').addClass('close');
                    $('.totals.shipping.excl').removeClass('open');
                    $('.totals.shipping.excl').removeClass('expanded');
                }
            });
            $(document).on('click', '.totals.shipping.incl', function() {
                if ($('.totals.shipping.incl').hasClass('close')) {
                    $('.totals.shipping.item').show();
                    $('.totals.shipping.incl').removeClass('close');
                    $('.totals.shipping.incl').addClass('open');
                    $('.totals.shipping.incl').addClass('expanded');
                } else {
                    $('.totals.shipping.item').hide();
                    $('.totals.shipping.incl').addClass('close');
                    $('.totals.shipping.incl').removeClass('open');
                    $('.totals.shipping.incl').removeClass('expanded');
                }
            });
        });

        return function (shipping) {
            return shipping.extend(mixin);
        };
    }
);
