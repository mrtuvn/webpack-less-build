define([
    'jquery',
    'uiComponent',
    'mage/translate',
    'matchMedia'
], function($, Component, $t, mediaCheck) {

    return Component.extend({
        initialize: function(config, element) {
            let el = $(element);

            // add mobile trigger before order links
            el.before('<div class="order-links-dropdown">' + el.find('.current').text() + '</div>');
            el.prev().on('click', function(event) {
                event.preventDefault();

                var ths = $(this);

                mediaCheck({
                    media: '(min-width: 960px)',
                    // Switch to Desktop Version
                    entry: function () {
                        ths.next().show();
                    },
                    // Switch to Mobile Version
                    exit: function () {
                        ths.next().toggle();
                    }
                });
            });

            this._super();
        }
    });

});