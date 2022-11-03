define(function () {
    'use strict';

    var mixin = {
        isDisplayed: function (elem) {
            return true;
        }
    };

    return function (target) {
        return target.extend(mixin);
    };
});
