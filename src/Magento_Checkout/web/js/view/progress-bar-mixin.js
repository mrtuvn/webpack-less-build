define([
    'jquery',
    'Magento_Checkout/js/model/step-navigator',
    'Magento_Checkout/js/model/shipping-address/list-state',
    'Magento_Checkout/js/model/confirm/confirm-state'
], function (
    $,
    stepNavigator,
    addressListState,
    confirmState
) {
    'use strict';

    return function (Component) {
        return Component.extend({
            initialize: function () {
                this._super();
            },

            goToPrevStep: function () {
                if (addressListState.isVisible()) {
                    addressListState.isVisible(false);
                    return;
                }

                let activeItemIndex = stepNavigator.getActiveItemIndex();
                let stepCode;

                switch (activeItemIndex) {
                    case 0:
                        $.mage.redirect(window.checkoutConfig.cartUrl);
                        break;
                    case 1:
                        stepCode = 'shipping';
                        break;
                    case 2:
                        stepCode = 'payment';
                        confirmState.isConfirmPage(false);
                        $(".checkout-agreement :input").prop( "checked", false);
                        break;
                    default:
                        stepCode = 'shipping';
                }
                stepNavigator.navigateTo(stepCode, null);
            },
        });
    };
});
