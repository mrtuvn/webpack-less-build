define(function () {
    'use strict';

    var mixin = {
        isDisplayed: function (elem) {
            return this.getPureValue() != 0
        }
    };

    return function (target) {
        return target.extend(mixin);
    };
});