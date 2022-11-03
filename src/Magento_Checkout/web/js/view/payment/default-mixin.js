define([
    'uiComponent',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/checkout-data',
], function (
    Component,
    quote,
    checkoutData
) {
    'use strict';
    return function (Component) {
        return Component.extend({
            /**
             * Place order.
             */
            placeOrder: function (data, event) {
                let selectedShippingMethod = '';
                if(quote.shippingMethod() && quote.shippingMethod()['carrier_title']){
                    selectedShippingMethod =  quote.shippingMethod()['carrier_title'];
                }
                checkout3Page(selectedShippingMethod, checkoutData.getSelectedPaymentMethod());
                return this._super(data, event)
            },
        });
    };
});