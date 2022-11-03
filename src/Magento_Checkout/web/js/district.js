define([
    'underscore',
    'uiRegistry',
    'Magento_Ui/js/form/element/select'
], function (_, registry, Select) {
    'use strict';

    return Select.extend({

        filter: function (value, field) {
            if (!this.initialOptions.length) {
                var district = registry.get(this.parentName + '.' + 'district_id');
                if (typeof district !== 'undefined') {
                    this.initialOptions = district.initialOptions;
                }
            }

            var source = this.initialOptions,
                result;
            field = field || this.filterBy.field;
            result = _.filter(source, function (item) {
                return item[field] === value;
            });

            this.setOptions(result);
        }
    });
});
