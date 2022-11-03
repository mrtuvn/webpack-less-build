define([
    'jquery',
    'uiComponent'
], function ($, Component) {
    'use strict';

    return Component.extend({
        initialize: function (config, element) {
            let container = $(element),
                numberWithCommas = function (price) {
                    let parts = price.toString().split(".");
                    let baseUrl = window.BASE_URL;
                    if (baseUrl.indexOf("/in/") >= 0) {
                        let x = parts[0].toString();
                        let lastThree = x.substring(x.length - 3);
                        let otherNumbers = x.substring(0, x.length - 3);
                        if (otherNumbers !== '')
                            lastThree = "," + lastThree;
                        parts[0] = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
                    } else {
                        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                    return parts.join(".");

                },
                updateTotalPrice = function (selectElement) {
                    let priceEl = selectElement.parents('.product-item-info').find('.price-final_price'),
                        qtyVal = parseInt(selectElement.val()),
                        priceVal = parseFloat(priceEl.find('.price-wrapper').addClass('individual').text().split(',').join('').substr(1)),
                        currency = priceEl.find('.price-wrapper').text().substr(0, 1),
                        formattedTotalPrice = currency + numberWithCommas((qtyVal * priceVal).toFixed(0));
                    priceEl.find('.price-wrapper').css('display', 'none');
                    if (priceEl.find('.msrp-computed-price').length) {
                        priceEl.find('.msrp-computed-price').text(formattedTotalPrice);
                    } else {
                        priceEl.find('.price-wrapper').after('<span class="msrp-computed-price">' + formattedTotalPrice + '</span>');
                    }
                };

            container.on('change', 'select.qty', function () {
                updateTotalPrice($(this));
            });
            container.find('select.qty').each(function () {
                updateTotalPrice($(this));
            });

            this._super();
        }
    });

});
