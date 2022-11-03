define([
    'jquery',
    'Lg_TaxHelper/js/view/checkout/cart/totals/show-tax'
], function ($, showTaxHelper) {
    'use strict';
    return function (Component) {
        return Component.extend({
            /**
             * rewrite parent method
             * @returns {boolean}
             */
            ifShowValue : function () {
                if (showTaxHelper.canShowTaxInSummary() === false) {
                    return false;
                }
                return this._super();
            },

            getDetails: function () {
                $('table.table-totals .totals-tax-summary.expanded').removeClass('expanded');

                return this._super();
            }
        });
    };
});
