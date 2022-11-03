define([
    'jquery',
    'uiComponent',
    'matchMedia'
], function($, Component, mediaCheck) {

    return Component.extend({
        initialize: function(config, element) {
            let el = $(element);

            el.before('<div class="subscription-links-dropdown">' + el.find('span').not(':first-child').text() + '</div>');

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