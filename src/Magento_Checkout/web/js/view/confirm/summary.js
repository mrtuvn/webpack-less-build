/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'Magento_Checkout/js/view/summary/abstract-total',
    'Magento_Checkout/js/model/quote',
    'Lg_TaxHelper/js/view/checkout/cart/totals/show-tax',
    'Magento_Checkout/js/model/totals'
], function ($, Component, quote, showTaxHelper, totals) {
    'use strict';

    return Component.extend({
        defaults: {
            template: 'Magento_Checkout/confirm/summary'
        },
        totals: quote.getTotals(),


        /**
         * @return {*}
         */
        isDisplayed: function () {
            return this.isFullMode();
        },

        /**
         * @return {*|Boolean}
         */
        isCalculated: function () {
            return this.totals() && this.isFullMode() && totals.getSegment('tax') != null;
        },


        getEstimatedTax: function () {
            if (!this.isCalculated()) {
                return this.getFormattedPrice(0);
            }
            return this.getFormattedPrice(window.checkoutConfig.totalsData.tax_amount);
        },

        getGrandTotal: function () {
            return this.getFormattedPrice(this.totals().base_grand_total);
        },

        getDiscountAmount: function () {
            return this.getFormattedPrice(this.totals().discount_amount);
        },

        ifShowValue : function () {
            if (showTaxHelper.canShowTaxInSummary() === false) {
                return false;
            }
            return true;
        },


        /**
         * Detect Mobile screen
         * @returns {boolean}
         */
        isMobile: function () {
            return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
                .test(navigator.userAgent));
        }

    });
});
