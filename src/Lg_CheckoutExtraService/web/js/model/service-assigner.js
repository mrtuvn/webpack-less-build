/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/*global alert*/
define([
    'jquery'
], function ($) {
    'use strict';

    return function (paymentData) {
        if (window.checkoutExtraServiceConfig.isCountryAllow === false) {
            return paymentData;
        }

        if (paymentData['extension_attributes'] === undefined) {
            paymentData['extension_attributes'] = {};
        }
        var formData = $('#co-shipping-method-form').serializeArray();
        var installService = [];
        var wasteHoseHoldCollection = [];
        if (window.checkoutExtraServiceConfig.house_hold_enable_by_item || window.checkoutExtraServiceConfig.installation_enable_by_item) {
            $.each(formData, function (index, val) {
                if (window.checkoutExtraServiceConfig.installation_enable_by_item) {
                    if (val.name.indexOf('installation-service_') !== -1) {
                        var key = val.name.replace('installation-service_', '');
                        installService.push({
                            key: key,
                            value: val.value
                        });
                    }
                }
                if (window.checkoutExtraServiceConfig.house_hold_enable_by_item) {
                    if (val.name.indexOf('waste-household-collection_') !== -1) {
                        var key = val.name.replace('waste-household-collection_', '');
                        wasteHoseHoldCollection.push({
                            key: key,
                            value: val.value
                        });
                    }
                }
            });
        }
        if (window.checkoutExtraServiceConfig.house_hold_enable && window.checkoutExtraServiceConfig.house_hold_enable_by_item === false) {
            var key = 0;
            var value = $('input[name="waste-household-collection"]:checked').val();
            wasteHoseHoldCollection.push({
                key: key,
                value: value === 'Yes' ? 'Yes' : 'No'
            });
        }
        if (window.checkoutExtraServiceConfig.install_service_enable && window.checkoutExtraServiceConfig.installation_enable_by_item === false) {
            var key = 0;
            var value = $('input[name="installation-service"]:checked').val();

            installService.push({
                key: key,
                value: parseInt(value) === 1 ? 1 : 0
            });
        }
        paymentData['extension_attributes']['installation_service'] = JSON.stringify(installService);
        paymentData['extension_attributes']['waste_household_collection'] = JSON.stringify(wasteHoseHoldCollection);
    };
});
