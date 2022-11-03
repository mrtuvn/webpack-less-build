define([
    'ko',
    'uiComponent',
    'Magento_Checkout/js/model/quote',
    'jquery',
    'mage/translate',
    'Magento_Catalog/js/price-utils',
    'Magento_Tax/js/view/checkout/summary/item/details/subtotal',
    'Magento_Weee/js/view/checkout/summary/item/price/row_incl_tax',
    'Magento_Weee/js/view/checkout/summary/item/price/row_excl_tax'
], function (
    ko,
    Component,
    quote,
    $,
    $t,
    priceUtils,
    itemTax,
    itemInclTax,
    itemExclTax
) {
    'use strict';

    /**
     * this class provides data to the items.html template and
     * collects the shipping rate selections for each item
     */
    return Component.extend({
        defaults: {
            confirmItems: ko.observableArray([])
        },
        initialize: function () {
            this._super();

            this.initItems.call(this);

            window.addEventListener('hashchange', function (event) {
                if (window.location.hash === '#confirm') {
                    this.initItems.call(this);
                }
            }.bind(this));
        },

        getDefaultConfirmItem: function (item) {
            return {
                thumbnail: item.thumbnail,
                model_name: item.product.model_name,
                name: item.name,
                qty: item.qty,
                price: priceUtils.formatPrice(parseFloat(this.getItemPrice(item)), quote.getPriceFormat(), false),
                delivery_lead_time_min: item.delivery_lead_time_min,
                delivery_lead_time_max: item.delivery_lead_time_max,
                shipping_name: $t("Shipping"),
                shipping_cost: $t("Free"),
            }
        },

        initItems: function () {
            let self = this;
            this.confirmItems([]);
            quote.getItems().forEach(function (item) {
                let confirmItem = this.getDefaultConfirmItem(item);

                if (quote.extension_attributes
                    && quote.extension_attributes.shipping_method_shipping_selections
                    && typeof quote.extension_attributes.shipping_method_shipping_selections[item.item_id] !== "undefined"
                    && typeof quote.extension_attributes.shipping_method_shipping_selections[item.item_id].carrier_value !== "undefined"
                ) {
                    let selectedRates = quote.extension_attributes.shipping_method_shipping_selections[item.item_id].carrier_value.split('_');

                    let costId = selectedRates[1].replace("costid-", "");

                    let rate = item.shippingRates().find(function (rate) {
                        return rate.cost_id && costId === rate.cost_id;
                    });

                    if (rate) {
                        Object.assign(confirmItem, {
                            shipping_name: rate.name,
                            shipping_cost: rate.formattedCost,
                        });
                    }
                }

                self.confirmItems.push(confirmItem);
            }.bind(self));
        },

        /**
         * @param quoteItem
         * @return {Number}
         */
        getItemPrice: function (quoteItem) {
            if (itemTax().isPriceInclTaxDisplayed()) {
                return itemInclTax().getRowDisplayPriceInclTax(quoteItem)/quoteItem.qty;
            }
            return itemExclTax().getRowDisplayPriceExclTax(quoteItem)/quoteItem.qty;
        }
    });
});
