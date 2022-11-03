define([
], function () {
    'use strict';
    let canShowTaxInSummary = true;
    if (window.hasOwnProperty('checkoutConfig') && window.checkoutConfig.hasOwnProperty('showTaxInCartSummary')) {
        canShowTaxInSummary = window.checkoutConfig.showTaxInCartSummary;
    }
    return {
        /**
         * @returns {boolean}
         */
        canShowTaxInSummary : function () {
            return canShowTaxInSummary;
        }
    };
});
