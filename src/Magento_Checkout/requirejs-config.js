var config = {
    config: {
        mixins: {
            'Magento_Checkout/js/view/summary/cart-items': {
                'Magento_Checkout/js/view/summary/cart-items-mixin': true
            },
            'Magento_Checkout/js/view/summary/totals': {
                'Magento_Checkout/js/view/summary/totals-mixin': true
            },
            
            'Magento_Checkout/js/view/summary/abstract-total': {
                'Magento_Checkout/js/view/summary/abstract-total-mixin': true
            },
            'Magento_Checkout/js/view/shipping-information': {
                'Magento_Checkout/js/view/shipping-information-mixin': true
            },
            'Magento_SalesRule/js/view/summary/discount': {
                'Magento_Checkout/js/view/summary/discount-mixin': true
            },
            'Magento_Checkout/js/view/progress-bar': {
                'Magento_Checkout/js/view/progress-bar-mixin': true
            },
            'mage/collapsible': {
                'Magento_Checkout/js/mage/collapsible-mixin': true
            },
            'Magento_Checkout/js/view/payment/default': {
                'Magento_Checkout/js/view/payment/default-mixin': true
            },
            'Magento_Checkout/js/view/shipping-address/address-renderer/default': {
                'Magento_Checkout/js/view/shipping-address/address-renderer/default-mixin': true
            },
            'Magento_Checkout/js/model/step-navigator': {
                'Magento_Checkout/js/model/step-navigator-mixin': true,
                'Lg_Checkout/js/model/step-navigator-mixin': false
            },
            'Magento_Checkout/js/model/checkout-data-resolver': {
                'Magento_Checkout/js/model/checkout-data-resolver-mixin': true,
            },
            'Lg_CheckoutHelper/js/model/shipping-rates-validator': {
                'Lg_Checkout/js/model/shipping-rates-validator-mixin': false
            },
            'Magento_Checkout/js/view/shipping': {
                'Magento_Checkout/js/view/shipping-mixin': true
            },
            'Lg_CheckoutHelper/js/view/summary/cart-items': {
                'Magento_Checkout/js/view/summary/cart-items-mixin': true
            },
            'Magento_Checkout/js/view/billing-address':{
                'Magento_Checkout/js/view/billing-address-mixin': true
            },
            'Magento_Tax/js/view/checkout/summary/tax':{
                'Magento_Checkout/js/view/summary/tax-mixin': true
            },
            'Magento_Checkout/js/model/billing-address-postcode-validator': {
                'Magento_Checkout/js/model/billing-address-postcode-validator-mixin': true,
            },
            'Magento_Ui/js/lib/validation/validator': {
                'Magento_Checkout/js/rule/validate-postcode-common': true,
            }
        }
    }
};
