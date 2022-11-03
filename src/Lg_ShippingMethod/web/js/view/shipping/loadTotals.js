define([
    'Magento_Checkout/js/model/quote',
    'jquery',
    'mage/translate',
    'Magento_Catalog/js/price-utils',
    'underscore'
], function (quote, $, $t, priceUtils, _) {
    'use strict';

    window.checkoutConfig.shippingMethodRates = {};
    return {
        getMethods: function () {
            if (window.checkoutConfig.shippingMethodRates.hasOwnProperty('methods')) {
                return window.checkoutConfig.shippingMethodRates['methods']
            }
            return [];
        },
        setMethods: function (methods) {
            window.checkoutConfig.shippingMethodRates['methods'] = methods;
        },
        getMethodByIdentifier: function (identifier) {
            var rates = this.getMethods();
            var method = null;
            rates.forEach(function (rate) {
                if (rate.value === identifier) {
                    method = rate;
                }
            });
            return method;
        },
        getPriceByCostId: function (costId, itemId) {
            var rates = this.getMethods();
            var price = null;
            rates.forEach(function (rate) {
                if (rate.cost_id === costId && rate.item_id === itemId) {
                    price = rate.cost;
                }
            });
            return price;
        },
        getShippingPriceTaxByCostId: function (costId, itemId) {
            var rates = this.getMethods();
            var shippingTaxPrice = null;
            rates.forEach(function (rate) {
                if (rate.cost_id === costId) {
                    shippingTaxPrice = rate.shippingTaxPrice;
                }
            });
            return shippingTaxPrice;
        },
        setShippingOrderSummary: function () {
            var items = quote.getItems();
            var self = this;
            var trShipping = null;
            var checkShippingClass = setInterval(function () {
                trShipping = $('.table-totals').find('.shipping:last');
                if ($('.table-totals').find('.shipping').length > 0) {
                    $('.totals.shipping').find('.amount').addClass('total-shipping-amount');
                    $.each(items, function (i, item) {
                        var nextShipping = $('.table-totals').find('.shipping-' + (i + 1) + ':last');
                        var lastShipping = $('.table-totals').find('.shipping:last');
                        item.index = i + 1;
                        var itemShipping = self.htmlItemShipping(item);
                        if (nextShipping.length === 0) {
                            $(itemShipping).insertAfter(lastShipping);
                        } else {
                            $(itemShipping).insertAfter(trShipping);
                        }
                        i++;
                        if (!quote.shippingMethod()) {
                            $(`.totals.shipping.excl.shipping-${item.index}`).hide();
                        }
                    });
                    clearInterval(checkShippingClass);
                }
            }, 1000);
        },
        showShippingCost: function() {
            var items = quote.getItems();
            this.setQuoteTotals();
        },
        htmlItemShipping: function (item) {
            var items = quote.getItems();
            if (typeof item.shippingRates()[0] == 'undefined') {
                return '';
            }
            return '<tr class="totals shipping item shipping-' + item.item_id + ' shipping-' + item.index + '" style="display: none;">' +
                '        <th class="mark" scope="row" style="padding-left: 1em">' +
                '            <span class="label" data-bind="i18n: title">' + $t('Shipping') + ' ' + (items.length > 1 ? item.index.toString() : '') + '</span>' +
                '            <span class="value" data-bind="text: getShippingMethodTitle()"></span>' +
                '        </th>' +
                '        <td class="amount">' +
                '            <span class="price" data-bind="text: getValue(), attr: {\'data-th\': title}" data-th="Shipment">' + this.getFormattedPrice(item.shippingRates()[0].cost) + '</span>' +
                '        </td>' +
                '    </tr>';
        },
        setShippingPrice: function (carrier) {
            if (carrier !== null && carrier !== undefined) {
                var cost = this.getFormattedPrice(carrier.cost);
                const items = quote.getItems();
                let index = 0;
                const item = _.find(items, iter => {
                    const rates = iter.shippingRates();
                    return _.find(rates, r => r.value === carrier.value) !== undefined;
                });
                if (item) {
                    index = item.index;
                }

                $('.shipping-' + index).find('.price').text(cost);
                this.setQuoteTotals();
            }
        },
        showOrNotCalendar: function (carrier, itemId) {
            if (carrier !== null && carrier.isRequiredDeliveryDate !== "0") {
                jQuery("div[data-item-identifier-calender=" + itemId + "]").show();
            } else {
                jQuery("div[data-item-identifier-calender=" + itemId + "]").hide();
            }
        },
        setQuoteTotals: function () {
            let baseTotal = parseFloat(window.checkoutConfig.quoteData.base_grand_total);
            let taxPriceAmount = parseFloat(window.checkoutConfig.totalsData.tax_amount);
            let shippingAmount = 0;

            for (let itemId in quote.extension_attributes.shipping_method_shipping_selections) {
                let itemSelect = {};
                itemSelect[itemId] = quote.extension_attributes.shipping_method_shipping_selections[itemId].carrier_value;
                let arr = itemSelect[itemId].split('_');
                let shippingCostId = arr[1].split('-')[1];
                let price = this.getPriceByCostId(shippingCostId, itemId);
                let shippingTaxPrice = this.getShippingPriceTaxByCostId(shippingCostId, itemId);

                if (price) {
                    baseTotal += parseFloat(price);
                    shippingAmount += parseFloat(price);
                }
                if (shippingTaxPrice) {
                    taxPriceAmount += parseFloat(shippingTaxPrice);
                    shippingAmount += parseFloat(shippingTaxPrice);
                }
            }
            let servicesCost = 0;
            quote.getItems().forEach(function(item) {
                servicesCost += this.calculateServiceFee(item);
            }.bind(this));

            baseTotal += servicesCost;
            shippingAmount += servicesCost;
            if ($('.totals.shipping').length > 0) {
                $('.table-totals').find('.grand .price').text(this.getFormattedPrice(baseTotal));
                $('.table-totals').find('.estimate-tax .amount').text(this.getFormattedPrice(taxPriceAmount));
                $('.table-totals').find('.totals.shipping.incl .total-shipping-amount .price').text(this.getFormattedPrice(shippingAmount));
                $('.table-totals').find('.totals.shipping.excl .total-shipping-amount .price').text(this.getFormattedPrice(shippingAmount));
                $("#mobile-confirm-grandtotal").text(this.getFormattedPrice(baseTotal));
                $("#mobile-confirm-tax").text(this.getFormattedPrice(taxPriceAmount));
            }
        },

        calculateServiceFee:function(item) {
            let servicesCost = 0;
            if(!item.shippingCostServices) {
                return servicesCost;
            }

            let itemServices = item.shippingCostServices();

            for (const key in itemServices) {
                if (itemServices.hasOwnProperty(key)) {
                    for (const service in itemServices[key]) {
                        if(itemServices[key][service].entity_id == item.selectedCostServices.installation()
                            || itemServices[key][service].entity_id == item.selectedCostServices.haulaway()) {
                            servicesCost += parseFloat(itemServices[key][service].fee);
                        }
                    }
                }
            }

            return servicesCost;
        },

        getFormattedPrice: function (price) {
            return priceUtils.formatPrice(price, quote.getPriceFormat());
        }
    }
});
