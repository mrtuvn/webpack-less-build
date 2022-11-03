define([
    'ko',
    'uiComponent',
    'underscore',
    'Magento_Checkout/js/model/step-navigator',
    'Magento_Checkout/js/model/confirm/confirm-state',
    'jquery'
], function (ko, Component, _, stepNavigator, confirmState, $) {
    'use strict';

    return Component.extend({
        defaults: {
            template: 'Magento_Checkout/confirm'
        },

        isVisible: ko.observable(true),

        /**
         * @returns {*}
         */
        initialize: function () {
            this._super();

            stepNavigator.registerStep(
                'confirm',
                null,
                'Order Complete',
                this.isVisible,

                _.bind(this.navigate, this),

                /**
                 * sort order value
                 * 'sort order value' < 10: step displays before shipping step;
                 * 10 < 'sort order value' < 20 : step displays between shipping and payment step
                 * 'sort order value' > 20 : step displays after payment step
                 */
                30
            );

            confirmState.isConfirmPage.subscribe(function (value) {
                this.getElementsInVisibleByConfirmState().forEach(function (element) {
                    if (value === true) {
                        $(element).hide();
                    } else {
                        $(element).show();
                    }
                })
            }.bind(this));

            return this;
        },

        /**
         * The navigate() method is responsible for navigation between checkout steps
         * during checkout. You can add custom logic, for example some conditions
         * for switching to your custom step
         * When the user navigates to the custom step via url anchor or back button we_must show step manually here
         */
        navigate: function () {
            this.isVisible(true);
        },

        /**
         * @returns void
         */
        placeOrder: function () {
            $('#co-payment-form .payment-method._active .actions-toolbar .primary button').trigger('click');
        },

        getElementsInVisibleByConfirmState: function () {
            return [".customer-info", ".dr-term"];
        }

    });
});