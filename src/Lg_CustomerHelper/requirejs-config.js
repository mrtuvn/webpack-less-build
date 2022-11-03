var config = {
    map: {
        '*': {
            addressValidation: 'Magento_Customer/js/addressValidation',
        }
    },
    config: {
        mixins: {
            'Magento_Customer/js/addressValidation': {
                'Lg_CustomerHelper/js/addressValidation-mixin': true
            },
            'mage/validation': {
                'Lg_CustomerHelper/js/custom-validate-telephone': true
            },
        }
    }
};