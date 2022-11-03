define([
    'mage/url'
],function (urlBuilder) {
    'use strict';

    var mixin = {
        resolveCheckboxText: function(checkboxText) {
            if (checkboxText.indexOf('|') > -1) {
                let checkboxArray = checkboxText.split('|'),
                    linkURL = urlBuilder.build(checkboxArray[1]);

                if(typeof checkboxArray[2] !== "undefined"){
                    return checkboxArray[0]+ '<a target="_blank" href="' + linkURL + '">' + checkboxArray[2] + '</a>';
                }
                return '<a target="_blank" href="' + linkURL + '">' + checkboxArray[0] + '</a>';
            }

            return checkboxText;
        },

        /**
         * build a unique id for the term checkbox
         *
         * @param {Object} context - the ko context
         * @param {Number} agreementId
         */
        getCheckboxId: function (context, agreementId) {
            var paymentMethodName = '',
                paymentMethodRenderer = context.$parents[1];

            // corresponding payment method fetched from parent context
            if (paymentMethodRenderer) {
                /*
                * using index instead of item.method
                *
                * - item.method is the same for each saved card
                * - index has an additional ID to the method name which makes the correct targeting
                *
                */
                paymentMethodName = paymentMethodRenderer.index ?
                    paymentMethodRenderer.index : paymentMethodRenderer.item.method;
            }

            return 'agreement_' + paymentMethodName + '_' + agreementId;
        },
    };

    return function (target) {
        return target.extend(mixin);
    };
});
