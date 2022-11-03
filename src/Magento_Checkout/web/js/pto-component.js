require([
    'jquery'
], function($){
   $(function(){
       $('select.qty', '#shopping-cart-table').on('change', function(){
           $('<div data-role="loader" class="loading-mask"><div class="loader" /></div>').appendTo('body');
       });
   });
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