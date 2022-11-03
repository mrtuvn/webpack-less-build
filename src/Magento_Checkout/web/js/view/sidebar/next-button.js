define([
    'uiComponent',
    'jquery',
    'ko',
    'mage/translate',
    'Magento_Checkout/js/model/step-navigator',
    'Magento_Checkout/js/checkout-data',
    'Magento_CheckoutAgreements/js/model/agreement-validator',
    'Magento_Checkout/js/model/shipping-address/list-state',
    'Magento_Checkout/js/model/confirm/confirm-state'
], function (
    Component,
    $,
    ko,
    $t,
    stepNavigator,
    checkoutData,
    agreementValidator,
    addressListState,
    confirmState
) {
    'use strict';


    return Component.extend({
        initialize: function () {
            this._super();
            var self = this;
            window.addEventListener('hashchange', function (event) {
                this.isDisable(window.location.hash === '#payment');
            }.bind(this));

            $('body').on("click", '#co-payment-form .checkout-agreement', function () {
                this.isDisable(!checkoutData.getSelectedPaymentMethod() || !agreementValidator.validate(true))
            }.bind(this));

            $('body').on("click", '#co-payment-form .payment-method-title', function (event) {
                let payment = $(event.currentTarget).find("input[name='payment[method]']").val();
                if (payment === checkoutData.getSelectedPaymentMethod()) {
                    return;
                }
                $('#co-payment-form .checkout-agreement').each(function (index, element) {
                    let type = $(element).find('input[type=checkbox]').attr('type');
                    if (type === 'radio' || type === 'checkbox') {
                        $(element).find('input[type=checkbox]').prop('checked', false);
                    }
                });
                this.isDisable(!checkoutData.getSelectedPaymentMethod() || !agreementValidator.validate(true))
            }.bind(this));

            this.isVisibleNextButton = ko.computed(function () {
                return !addressListState.isVisible();
            });

            this.isVisibleApplyAddressButton = ko.computed(function () {
                return addressListState.isVisible();
            });
        },

        /**
         * @return {exports.initObservable}
         */
        initObservable: function () {
            this._super()
                .observe({
                    isDisable: ko.observable(window.location.hash === '#payment'),
                });

            return this;
        },

        getLable: function () {
            let activeItemIndex = stepNavigator.getActiveItemIndex();

            switch (activeItemIndex) {
                case 0:
                    return this.isMobile() ? $t('Cash Register') : $t('Next Step');
                case 1:
                    return this.isMobile() ? $t('Next') : $t('Next Step');
                case 2:
                    return $t('Confirm And Checkout');
                default:
                    return this.isMobile() ? $t('Next') : $t('Next Step');
            }
        },

        getElementsVisibleByAddressState: function () {
            return [".shipping-address-item.not-selected-item", ".action.action-show-popup"];
        },

        getElementsInVisibleByAddressState: function () {
            return [".customer-info", "#opc-shipping_method", ".opc-block-summary", "#shipping-address-title", ".dr-term"];
        },

        confirmAddress: function () {
            addressListState.isVisible(false);
        },

        next: function () {
            let activeItemIndex = stepNavigator.getActiveItemIndex();

            switch (activeItemIndex) {
                case 0:
                    this.setShippingInformation();
                    break;
                case 1:
                    this.isMobile() ? this.showConfirmPage() : this.placeOrder();
                    break;
                case 2:
                    this.placeOrder();
                    break;
                default:
                    this.placeOrder();

            }
        },

        setShippingInformation: function () {
            $("#co-shipping-method-form").submit();
        },

        showConfirmPage: function () {
            stepNavigator.next();
            confirmState.isConfirmPage(true);
        },

        placeOrder: function () {
            $('#co-payment-form .payment-method._active .actions-toolbar .primary button').trigger('click');
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
})
;