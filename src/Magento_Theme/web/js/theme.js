define([
    'jquery',
], function ($) {
    'use strict';

    $(document).ready(function () {
        $(document).off('click', ".pto-components .comp-label").on('click', '.pto-components .comp-label', function() {
            var element = $(this);
            var elementShow = element.parent().find('.model-name-comp');
            if (elementShow.hasClass('open')) {
                elementShow.removeClass('open');
                element.removeClass('active');
            } else {
                $('.model-name-comp').removeClass('open');
                element.addClass('active');
                elementShow.addClass('open');
            }
        });
    });
});