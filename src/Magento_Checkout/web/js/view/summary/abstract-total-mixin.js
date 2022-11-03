define(function () {
    'use strict';

    var mixin = {
        isFullMode: function () {
            if (!this.getTotals()) {
                return false;
            }

            return true;
        }
    };

    return function (target) {
        return target.extend(mixin);
    };
});