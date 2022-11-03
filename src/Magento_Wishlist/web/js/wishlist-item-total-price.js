define([
    'jquery',
    'uiComponent',
    'Magento_Catalog/js/price-utils'
], function ($, Component, priceUtils) {
    'use strict';

    return Component.extend({
        initialize: function (config, element) {
            let container = $(element),
                self = this;

            container.on('change', 'select.qty', function () {
                self.updateTotalPrice($(this), config);
            });

            container.find('select.qty').each(function () {
                self.updateTotalPrice($(this), config);
            });

            this._super();
        },
        updateTotalPrice: function (selectElement, config) {
            let formattedTotalPrice = this.getFormattedPrice(selectElement, config),
                priceEl = this.getPriceElement(selectElement);

            if (priceEl.find('.computed-price').length) {
                priceEl.find('.computed-price').text(formattedTotalPrice);
            } else {
                priceEl.find('.price').after('<span class="computed-price">' + formattedTotalPrice + '</span>');
            }
        },
        getFormattedPrice: function (selectElement, config) {
            let priceEl = this.getPriceElement(selectElement),
                priceVal = parseFloat(priceEl.find('.price-wrapper').data('price-amount'));
            return this.formatPrice((priceVal), config);
        },
        getPriceElement: function(selectElement) {
            return selectElement.parents('.product-item-info').find('.price-final_price');
        },
        formatPrice: function (totalPrice, config) {
            return priceUtils.formatPrice(totalPrice, config.priceFormat);
        },
    });
});
