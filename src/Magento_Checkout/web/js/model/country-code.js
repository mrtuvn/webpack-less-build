/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

 define([], function () {
    'use strict';

    return {
        /**
         * Perform postponed binding for fieldset elements
         *
         * @param {String} IOSCode
         */
        getContryCodeByIOSCode: function (IOSCode) {
            const countryCodes = {
                'PA': '+507',
                'AT': '+43',
                'EG': '+20',
                'BE': '+32',
                'BG': '+359',
                'DE': '+49',
                'DK': '+45',
                'EE': '+372',
                'FI': '+358',
                'FR': '+33',
                'GR': '+30',
                'IE': '+353',
                'IS': '+354',
                'IT': '+39',
                'HR': '+385',
                'LV': '+371',
                'LI': '+423',
                'LT': '+370',
                'LU': '+352',
                'MT': '+356',
                'NL': '+31',
                'NO': '+47',
                'PL': '+48',
                'PT': '+351',
                'RO': '+40',
                'PE': '+51',
                'SE': '+46',
                'SK': '+421',
                'SI': '+386',
                'ES': '+34',
                'CZ': '+420',
                'HU': '+36',
                'GB': '+44',
                'CY': '+357',
                'CH': '+41',
                'CL': '+56',
                'VN': '+84',
                'MX': '+52'
            };

            return countryCodes[IOSCode] || countryCodes['AT'];
        }
    };
});
