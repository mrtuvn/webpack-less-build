define([
    'jquery',
    'Magento_Checkout/js/model/postcode-validator',
    'mage/translate'
], function (
    $,
    postcodeValidator,
    $t
) {
    'use strict';

    return function (validator) {
        var countryId = (typeof window.checkoutConfig !== 'undefined') ? window.checkoutConfig.defaultCountryId : null;
        var validateMessage =(countryId !== null) ? $t('Provided Zip/Postal Code seems to be invalid.') + $t(' Example: ') + postcodeValidator.examplePostcode(countryId).join('; ') + '. ' : '';

        validator.addRule(
            'common-postcode',
            function (value) {
                if (value == null) {
                    return true;
                }
                if (countryId == null) {
                    return true;
                }
                return postcodeValidator.validate(value, countryId);
            },
            validateMessage
        );
        return validator;
    }
});