define([
    'ko',
    'Magento_Checkout/js/model/quote'
],function (ko, quote) {
    'use strict';

    var mixin = {
        items: ko.observableArray([]),
        shippingMethods: ko.observableArray([]),
        initialize: function() {

            this.items(quote.getItems());
            if (quote.extension_attributes !== undefined) {
                this.shippingMethods(quote.extension_attributes.innovel_shipping_selections);
            }

            this._super();
        }
    };

    return function (target) {
        return target.extend(mixin);
    };
});
