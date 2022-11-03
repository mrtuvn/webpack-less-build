define([
        'ko',
        'jquery',
        'Magento_Checkout/js/model/shipping-address/list-state',
        'Magento_Checkout/js/model/country-code',
        'Magento_Checkout/js/model/quote',
        'Magento_Checkout/js/model/checkout-data-resolver',
        'Magento_Checkout/js/action/set-shipping-information',
        'Magento_Checkout/js/model/step-navigator',
        'Magento_Catalog/js/price-utils',
        'Magento_Customer/js/model/address-list',
        'mage/translate'
    ], function (
        ko,
        $,
        addressListState,
        countryCode,
        quote,
        checkoutDataResolver,
        setShippingInformationAction,
        stepNavigator,
        priceUtils,
        addressList,
        $t
    ) {
        'use strict';

        let mixin = {

            addressOptions: addressList().filter(function (address) {
                return address.getType() === 'customer-address'; //eslint-disable-line eqeqeq
            }),

            isDisableSaveInAddressBook: ko.observable(false),
            isShowShippingSaveInAddressBook: ko.observable(true),

            enableLimitAddress: window.checkoutConfig.address_limit.address_limit_enable,
            numberLimitAddress: window.checkoutConfig.address_limit.address_limit_number,

            initialize: function () {
                this._super();

                if (this.enableLimitAddress === '1' && this.addressOptions.length >= parseInt(this.numberLimitAddress)) {
                    this.isDisableSaveInAddressBook(true);
                    this.saveInAddressBook = 0
                    this.isShowShippingSaveInAddressBook(false);
                }

                var self = this;
                this.checkStepCustom();
                window.addEventListener('hashchange', function () {
                    self.checkStepCustom();
                });

                //check customer login for styling
                if (this.isCustomerLoggedIn()) {
                    $("body").addClass('customer-login');
                    $("body").removeClass('customer-notlogin');
                } else {
                    $("body").addClass('customer-notlogin');
                    $("body").removeClass('customer-login');
                }

                addressListState.isVisible.subscribe(function (value) {
                    if (this.isNewAddressAdded() || !value) {
                        $(".action.action-show-popup").hide();
                    } else {
                        $(".action.action-show-popup").show();
                    }

                    this.getElementsVisibleByAddressState().forEach(function (element) {
                        if (value === true) {
                            $(element).show();
                        } else {
                            $(element).hide();
                        }
                    })

                    this.getElementsInVisibleByAddressState().forEach(function (element) {
                        if (value === true) {
                            $(element).hide();
                        } else {
                            $(element).show();
                        }
                    })

                }.bind(this));

                var items = quote.getItems();
                _.each(items, function (item) {
                    let rowTotalInclTax = parseFloat(item['row_total_incl_tax']);
                    if (window.checkoutConfig.getIncludeWeeeFlag && item.weee_tax_applied) {
                        var totalWeeeTaxInclTaxApplied = 0,
                            weeeTaxAppliedAmounts;

                        weeeTaxAppliedAmounts = JSON.parse(item.weee_tax_applied);
                        weeeTaxAppliedAmounts.forEach(function (weeeTaxAppliedAmount) {
                            totalWeeeTaxInclTaxApplied += parseFloat(Math.max(weeeTaxAppliedAmount['row_amount_incl_tax'], 0));
                        });
                        rowTotalInclTax += totalWeeeTaxInclTaxApplied;
                    }
                    item.formattedRowTotal = this.getFormattedPrice(rowTotalInclTax);
                }, this);
            },

            getElementsVisibleByAddressState: function () {
                return [".shipping-address-item.not-selected-item"];
            },

            getElementsInVisibleByAddressState: function () {
                return [".customer-info", "#opc-shipping_method", ".opc-block-summary", "#shipping-address-title", ".dr-term", ".company-individual-block"];
            },

            /**
             * Save new shipping address
             */
            saveNewAddress: function () {
                this._super();
                addressListState.isVisible(false);
            },

            checkStepCustom: function () {
                //for styling
                var hashCode = window.location.hash;
                if (hashCode === "#payment") {
                    $("body").addClass("payment-step");
                    $("body").removeClass("shipping-step");
                    $("body").removeClass("confirm-step");
                } else if (hashCode === "#shipping") {
                    $("body").addClass("shipping-step");
                    $("body").removeClass("payment-step");
                    $("body").removeClass("confirm-step");
                } else if (hashCode === "#confirm") {
                    $("body").addClass("confirm-step");
                    $("body").removeClass("payment-step");
                    $("body").removeClass("shipping-step");
                }
            },
            getCountryCode: function (countryId) {
                if (window.checkoutConfig.checkout.address.is_enable_country_code) {
                    return countryCode.getContryCodeByIOSCode(countryId);
                } else {
                    return '';
                }
            },
            /**
             * Set shipping information handler
             */
            setShippingInformation: function () {
                if (this.validateShippingInformation()) {
                    quote.billingAddress(null);
                    checkoutDataResolver.resolveBillingAddress();
                    setShippingInformationAction().done(
                        function () {
                            stepNavigator.next();
                        }
                    );
                }
            },

            getFormattedPrice: function (price) {
                return priceUtils.formatPrice(price, quote.getPriceFormat());
            },

            validateShippingInformation: function () {
                var isValid = this._super();
                if (isValid) {
                    var wasteSelector = 'input:radio[name=waste-household-collection]';
                    var installationServiceSelector = 'input:radio[name=installation-service]';
                    $(".message.message-error.warning").hide('blind', {}, 500);
                    if ($(installationServiceSelector).offset()) {
                        if (!$(installationServiceSelector).is(':checked')) {
                            $(installationServiceSelector).closest('.checkout-waste').find(".table-checkout-waste").last().after('<div role="alert" class="message message-error warning"><div data-ui-id="checkout-cart-validationmessages-message-error" data-bind="text: $data">' + $t('Please choose if you need the installation service of the used product') + '</div></div>');
                            $(installationServiceSelector).closest('.checkout-waste').get(0).scrollIntoView()
                            return false;
                        }
                    }

                    if ($(wasteSelector).offset()) {
                        if (!$(wasteSelector).is(':checked')) {
                            $(wasteSelector).closest('.checkout-waste').find(".table-checkout-waste").last().after('<div role="alert" class="message message-error warning"><div data-ui-id="checkout-cart-validationmessages-message-error" data-bind="text: $data">' + $t('Please choose if you need the collection service of the used product') + '</div></div>');
                            $(wasteSelector).closest('.checkout-waste').get(0).scrollIntoView()
                            return false;
                        }
                    }
                }

                return isValid;
            }
        };

        return function (target) {
            return target.extend(mixin);
        };
    }
);
