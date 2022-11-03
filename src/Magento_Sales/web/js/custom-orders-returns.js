define([
    'jquery','jquery/ui', 'jquery/validate', 'mage/translate', 'mage/mage'
], function($){
    "use strict";

    function main(config, element) {
        const options = {
            zipCode: '#oar-zip', // Search by zip code.
            pinCode: '#oar-pin', // Search by pin code.
            emailAddress: '#oar-email', // Search by email address.
            searchType: '#quick-search-type-id' // Search element used for choosing between the two.
        };
        const showIdentifyBlock =  function (value) {
            $(options.zipCode).toggle(value === 'zip');
            $(options.pinCode).toggle(value === 'pin');
            $(options.emailAddress).toggle(value === 'email');
        };
        showIdentifyBlock($('#quick-search-type-id option:selected').val());
        $('.find').on("change", $(options.searchType), function(e) {
            let value = $(e.target).val();
            showIdentifyBlock(value);
        });
    };
    return main;
});