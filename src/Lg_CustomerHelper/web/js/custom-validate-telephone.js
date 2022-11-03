define(['jquery'], function ($) {
    'use strict';

    return function () {
        var prefixTele = window.prefixTele;
        $.validator.addMethod(
            'telephone',
            function (value) {
                return /(^[0-9]{9,15}$)/.test(value);
            },
            $.mage.__('Phone number should have 9 to 15 digits. Sample '+ prefixTele +' 1234567890')
        );
        $.validator.addMethod(
            'telephone-number',
            function (value) {
                return /(^\d+$)/.test(value);
            },
            $.mage.__('Please enter a valid number in this field')
        );
        $.validator.addMethod(
            'required-telephone',
            function (value) {
                return $.trim(value).length > 0;
            },

            $.mage.__("Phone number is required.")
        );
    }
});
