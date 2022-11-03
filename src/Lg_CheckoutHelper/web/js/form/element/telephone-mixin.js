define([
    'ko',
    'Magento_Checkout/js/model/country-code',
    'Magento_Checkout/js/model/quote',
    'Magento_Ui/js/lib/validation/validator'
], function(ko, countryCode, quote, validator) {
    'use strict';

    return function (Abstract) {
        return Abstract.extend({
            defaults: {
                tmpValue: null
            },

            /**
             * Init observable.
             *
             * @return {Object}
             */
            initObservable: function () {
                this._super()
                    .observe('tmpValue');

                return this;
            },
            getCountryCode: function(countryId) {
                if (window.checkoutConfig.checkout.address.is_enable_country_code) {
                    return countryCode.getContryCodeByIOSCode(countryId);
                } else {
                    return '';
                }
            },
            address: function () {
                return quote.shippingAddress();
            },
            initialize: function() {
                this._super();
                this.tmpValue.subscribe(function (value) {
                    if (window.checkoutConfig.checkout.address.is_enable_country_code) {
                        let prefixTele = countryCode.getContryCodeByIOSCode(quote.shippingAddress().countryId);
                        this.value(prefixTele + value);
                    } else {
                        this.value(value);
                    }
                }, this);
            },

            validate: function () {
                let value;
                if (window.checkoutConfig.checkout.address.is_enable_country_code) {
                    value = this.tmpValue() ? this.tmpValue() : '';
                } else {
                    value = this.value();
                }
                var result = validator(this.validation, value, this.validationParams),
                    message = !this.disabled() && this.visible() ? result.message : '',
                    isValid = this.disabled() || !this.visible() || result.passed;

                this.error(message);
                this.error.valueHasMutated();
                this.bubble('error', message);

                //TODO: Implement proper result propagation for form
                if (this.source && !isValid) {
                    this.source.set('params.invalid', true);
                }

                return {
                    valid: isValid,
                    target: this
                };
            },
        });
    };
});
