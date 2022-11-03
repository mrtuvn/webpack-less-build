define(function () {
    'use strict';

    var mixin = {
        isItemsBlockExpanded: function (elem) {
            return true;
        }
    };

    return function (target) {
        return target.extend(mixin);
    };
});
