define([], function () {
    'use strict';

    return function (Component) {
        return Component.extend({
            /**
             * Detect Mobile screen
             * @returns {boolean}
             */
            isMobile: function () {
                return false; /* not use function show coupon lists popup at mobile */
            }
        });
    };
});
