define([
    'jquery',
    'mage/utils/wrapper',
    'Lg_ShippingMethod/js/view/shipping/items',
], function ($, wrapper, items) {
    'use strict';

    return function (stepNavigator) {
        stepNavigator.next = wrapper.wrapSuper(stepNavigator.next, function () {
            let activeItemIndex = this.getActiveItemIndex();
            if (activeItemIndex === 0 && !items().isVisible()) {
                $('li#shipping').show();
                return;
            }

            return this._super();
        });

        return stepNavigator;
    };
});