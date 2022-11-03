define([
    'jquery',
    'Magento_Checkout/js/model/country-code'
], function (
    $,
    countryCode
) {
    'use strict';

    let addressValidation = {
        _create: function () {
            var button = $(this.options.selectors.button, this.element);
            this.zipInput = $(this.options.selectors.zip, this.element);
            this.countrySelect = $(this.options.selectors.country, this.element);

            this.element.validation({
                /**
                 * Submit Handler
                 * @param {Element} form - address form
                 */
                submitHandler: function (form) {
                    if (window.isEnableCountryCode) {
                        let countryId = $('.form-address-edit select[name="country_id"]:visible').val();
                        let prefixTelephone = countryCode.getContryCodeByIOSCode(countryId);
                        let telephone = $('.form-address-edit input[name="tele"]').val();
                        $('.form-address-edit input[name="telephone"]').val(prefixTelephone + telephone);

                    }
                    else {
                        let telephone = $('.form-address-edit input[name="tele"]').val();
                        $('.form-address-edit input[name="telephone"]').val(telephone);
                    }

                    button.attr('disabled', true);
                    form.submit();
                }
            });

            this._addPostCodeValidation();
        },
    };

    return function (targetWidget) {
        $.widget('mage.addressValidation', $.mage.addressValidation, addressValidation);

        return $.mage.addressValidation;
    };
});