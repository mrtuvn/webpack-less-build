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
    'Magento_Customer/js/customer-data'
], function ($, ko, Component, selectShippingAddressAction, quote, formPopUpState, checkoutData, customerData) {
    'use strict';

    const countryData = customerData.get('directory-data');

    return Component.extend({
        defaults: {
            template: 'Magento_Checkout/confirm/address'
        },
        address: quote.shippingAddress,


        /**
         * @param {String} countryId
         * @return {String}
         */
        getCountryName: function (countryId) {
            return countryData()[countryId] !== undefined ? countryData()[countryId].name : ''; //eslint-disable-line
        },
    });
});
