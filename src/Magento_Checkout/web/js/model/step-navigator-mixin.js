define([
    'jquery',
    'mage/utils/wrapper'
], function ($,
             wrapper
) {
    'use strict';

    return function (stepNavigator) {
        stepNavigator.navigateTo = wrapper.wrapSuper(stepNavigator.navigateTo, function (code, scrollToElementId) {
            this._super(code, scrollToElementId);
            //Todo maybe done need , will check late
            if (code === 'shipping') {
                $('.privacy-links').hide();
            }
        });

        stepNavigator.next = wrapper.wrapSuper(stepNavigator.next, function () {
            this._super();
            //Todo maybe done need , will check late
            collapsibleBlock();
            $(".opc-block-summary").show();

            // Show terms.
            $('.privacy-links').show();

            //lmds bug fixing: click next -> total not include shipping cost
            // lgShippingMethod.setQuoteTotals();
        });

        function collapsibleBlock() {
            $("#delivery-info-container").collapsible({
                openedState: "active",
                "disabled": false,
                animate: {"duration": 500, "easing": "easeOutCubic"},
            });

            $("#delivery-info-container").collapsible("enable");
            $("#delivery-info-container").collapsible("activate");

            $("#payment-container").collapsible({
                openedState: "active",
                "disabled": false,
                animate: {"duration": 500, "easing": "easeOutCubic"},
            });

            $("#payment-container").collapsible("enable");
            $("#payment-container").collapsible("activate");

        }

        return stepNavigator;
    };
});