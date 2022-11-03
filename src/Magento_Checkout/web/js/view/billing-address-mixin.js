/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
        'ko',
        'Magento_Customer/js/model/address-list',
        'Magento_Checkout/js/model/quote',
        'Magento_Customer/js/customer-data',
        'mage/translate',
        'jquery',
        'Magento_Checkout/js/model/country-code',
    ],
    function (
        ko,
        addressList,
        quote,
        customerData,
        $t,
        $,
        countryCode
    ) {
        'use strict';

        var lastSelectedBillingAddress = null,
            newAddressOption = {
                /**
                 * Get new address label
                 * @returns {String}
                 */
                getAddressInline: function () {
                    return $t('New Address');
                },
                customerAddressId: null
            },
            countryData = customerData.get('directory-data'),
            addressOptions = addressList().filter(function (address) {
                return address.getType() == 'customer-address'; //eslint-disable-line eqeqeq
            });

        addressOptions.push(newAddressOption);

        let mixin = {
            defaults: {
                template: 'Magento_Checkout/billing-address',
                imports: {
                    active: 'checkout.steps.billing-step.payment:isVisible'
                }
            },
            currentBillingAddress: quote.billingAddress,
            addressOptions: addressOptions,
            customerHasAddresses: addressOptions.length > 1,
            isDisableSaveInAddressBook: ko.observable(false),
            isShowBillingSaveInAddressBook: ko.observable(true),
            active: ko.observable(false),
            enableLimitAddress: window.checkoutConfig.address_limit.address_limit_enable,
            numberLimitAddress: window.checkoutConfig.address_limit.address_limit_number,

            initialize: function () {
                this._super();
                if (this.enableLimitAddress === '1' && addressOptions.length >= parseInt(this.numberLimitAddress)) {
                    this.isDisableSaveInAddressBook(true);
                    this.saveInAddressBook(0);
                    this.isShowBillingSaveInAddressBook(false);
                }
            },

            /**
             *
             */
            foo: function (ui, e) {
                if (e.type === 'keyup') {
                    if (e.keyCode === 32) {
                        if (e.stopPropagation) e.stopPropagation();
                    }
                }
            },

            /**
             * Update address action
             */
            updateAddress: function () {
                this._super();
                this.updateAddresses();
            },

            /**
             * @param {Object} address
             */
            onAddressChange: function (address) {
                this.isAddressFormVisible(!address.customerAddressId); //eslint-disable-line eqeqeq
                if (this.enableLimitAddress === '1' && addressOptions.length >= parseInt(this.numberLimitAddress)) {
                    this.isDisableSaveInAddressBook(true);
                    this.isShowBillingSaveInAddressBook(false);
                }
            },

            /**
             * Detect Mobile screen
             * @returns {boolean}
             */
            isMobile: function () {
                return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
                    .test(navigator.userAgent));
            },
        }


        return function (target) {
            return target.extend(mixin);
        };
    });
