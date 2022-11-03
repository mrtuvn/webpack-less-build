/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'ko',
    'uiComponent',
    'Magento_Checkout/js/action/select-shipping-address',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/model/shipping-address/form-popup-state',
    'Magento_Checkout/js/checkout-data',
    'Magento_Customer/js/customer-data',
    'Magento_Checkout/js/model/shipping-address/list-state',
    'Magento_Checkout/js/model/country-code'
], function (
    $,
    ko,
    Component,
    selectShippingAddressAction,
    quote,
    formPopUpState,
    checkoutData,
    customerData,
    addressListState,
    countryCode
) {
    'use strict';
    const countryData = customerData.get('directory-data');

    return function (Component) {
        return Component.extend({
            /** @inheritdoc */
            initObservable: function () {
                this._super();
                this.isSelected = ko.computed(function () {
                    let isSelected = false,
                        shippingAddress = quote.shippingAddress();

                    if (shippingAddress) {
                        isSelected = shippingAddress.getKey() == this.address().getKey(); //eslint-disable-line eqeqeq
                        if (isSelected) {
                            selectShippingAddressAction(shippingAddress);
                            checkoutData.setSelectedShippingAddress(shippingAddress.getKey());
                        }
                    }

                    return isSelected;
                }, this);

                return this;
            },

            getAddressListState: function () {
                return addressListState.isVisible();
            },


            mobileHideNotChosenAddress: function () {
                if (this.isMobile()) {
                    $(".shipping-address-item.not-selected-item").hide();
                    $(".action.action-show-popup").hide();
                }
            },

            showAddressList: function () {
                addressListState.isVisible(true);
            },

            /**
             * Detect Mobile screen
             * @returns {boolean}
             */
            isMobile: function () {
                return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
                    .test(navigator.userAgent));
            },

            /**
             * @param {String} countryId
             * @return {String}
             */
            getCountryName: function (countryId) {
                return countryData()[countryId] !== undefined ? countryData()[countryId].name : ''; //eslint-disable-line
            },

            /** Set selected customer shipping address  */
            selectAddress: function () {
                selectShippingAddressAction(this.address());
                checkoutData.setSelectedShippingAddress(this.address().getKey());
            },

            /**
             * Edit address.
             */
            editAddress: function () {
                formPopUpState.isVisible(true);
                this.showPopup();

            },

            /**
             * Show popup.
             */
            showPopup: function () {
                $('[data-open-modal="opc-new-shipping-address"]').trigger('click');
            },

            /**
             * Get Telephone number.
             */
            getTelephone: function (countryId, telephone) {
                let prefixTele = countryCode.getContryCodeByIOSCode(countryId);

                if (telephone.substring(0, prefixTele.length) !== prefixTele && window.checkoutConfig.checkout.address.is_enable_country_code) {
                    return prefixTele + telephone;
                }
                return telephone;
            }
        });
    };
});
