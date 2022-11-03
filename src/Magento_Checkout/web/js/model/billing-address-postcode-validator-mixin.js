/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'Magento_Checkout/js/model/postcode-validator',
    'mage/translate',
    'mage/utils/wrapper'
], function (
    $,
    postcodeValidator,
    $t,
    wrapper
) {
    'use strict';
    return function (billingAddressPostcodeValidator) {
        billingAddressPostcodeValidator.postcodeValidation = wrapper.wrapSuper(billingAddressPostcodeValidator.postcodeValidation, function (postcodeElement) {
            var countryId = $('select[name="country_id"]:visible').val(),
                validationResult,
                warnMessage;
            if (postcodeElement == null || postcodeElement.value() == null) {
                return true;
            }

            postcodeElement.warn(null);
            validationResult = postcodeValidator.validate(postcodeElement.value(), countryId);

            if (!validationResult) {
                warnMessage = $t('Provided Zip/Postal Code seems to be invalid.');

                if (postcodeValidator.validatedPostCodeExample.length) {
                    warnMessage += $t(' Example: ') + postcodeValidator.validatedPostCodeExample.join('; ') + '. ';
                }
                postcodeElement.warn(null);
            }

            return validationResult;
        });

        return billingAddressPostcodeValidator;
    };
});
