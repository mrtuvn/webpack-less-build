define(
    [
        'jquery',
        'uiComponent',
    ],
    function (
        $,
        Component
    ) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'CyberSource_SecureAcceptance/payment/secure/token',
            },
            getSecureToken: function () {
                return window.checkoutConfig.payment.chcybersource.secure_token;
            }
        });
    }
);
