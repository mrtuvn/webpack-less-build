define([
    'uiComponent',
    'ko',
    'jquery',
    "Magento_Ui/js/modal/modal",
    'mage/storage',
    'Magento_SalesRule/js/action/set-coupon-code',
    'Magento_SalesRule/js/action/cancel-coupon',
    'Magento_Checkout/js/model/quote',
    'mage/url',
    'Lg_CustomMultiCoupon/js/view/cart/pincode/pincode',
    'Lg_CustomMultiCoupon/js/view/cart/validate/validate-block-shipping',
    'mage/translate'
], function (Component, ko, $, modal, storage, setCouponCodeAction, cancelCouponAction, quote, urlBuilder, pinCode, validateBlockShipping) {
    'use strict';
    return Component.extend({
        defaults: {
            //template: 'Lg_CustomMultiCoupon/cart/coupon/single/list-coupon',
            checkUrl: 'multicoupon/coupon/check',
            applyCouponUrl: 'multicoupon/coupon/apply',
            listCouponUrl: 'multicoupon/coupon/listcoupon',
            coupons: ko.observableArray([]),
            hasWaitingCoupons: false,
            isGuest: true,
            isCheckCodeValid: ko.observable(false),
            messageCodeError: ko.observable(''),
            messageCodeErrorModal: ko.observable(''),
            messageCodeSuccess: ko.observable(''),
            isDisabledApply: ko.observable(false),
            expandedCouponList: false,
            dropdownText: ko.observable(''),
            hasReferrerCoupon: false
        },

        options: {
            checkCoupon: "#action-coupon-check",
            couponCode: "#coupon_code",
            blockDiscount: "#block-discount",
            listCoupon: "#list-coupon",
            sectionCoupon: "#section-coupon",
            checkCouponForm: "#check-coupon-form"
        },

        /**
         * Add a coupon auto valid
         * @param coupon
         * @param retrievedAvailCoupon
         */
        addValidCoupon: function (coupon, retrievedAvailCoupon = false) {
            let error = false;
            $.each(window.listCouponApplied, function (idx, applied) {
                if (applied.coupon_code === coupon.code) {
                    error = true;
                }
            });
            if (error) {
                this.messageCodeError($.mage.__('Coupon %1 already applied').replace('%1', coupon.code));
                this.showErrorManualInput();
                return;
            }

            var validCoupon = this.coupons.filter(function (f) {
                return f.coupon_id === coupon.coupon_id;
            });
            if (validCoupon.length === 0) {
                if (retrievedAvailCoupon === true) {
                    this.showListCoupon();
                    coupon.is_disable = ko.observable(coupon.is_disable);
                    coupon.is_check_coupon = ko.observable(coupon.is_check_coupon);
                    this.coupons.unshift(coupon);
                    $(this.options.couponCode).val('');
                    return;
                }

                if (this.expandedCouponList === false) {
                    this.getListCoupon(coupon);
                } else {
                    coupon.is_disable = ko.observable(coupon.is_disable);
                    coupon.is_check_coupon = ko.observable(coupon.is_check_coupon);
                    this.coupons.unshift(coupon);
                    $(this.options.couponCode).val('');
                }
            } else {
                this.applySingleCoupon(validCoupon[0], true);
            }
        },

        /**
         * Show loader
         * @param isShow
         */
        showLoading: function (isShow) {
            if (isShow) {
                $(this.options.sectionCoupon).parents('aside').css({'z-index': 10});
                $(this.options.sectionCoupon).trigger('processStart');
            } else {
                $(this.options.sectionCoupon).parents('aside').css({'z-index': 10003});
                $(this.options.sectionCoupon).trigger('processStop');
            }
        },

        /**
         * Event enter check coupon on input
         * @param event
         */
        enterCheckCoupon: function (data, event) {
            if ($(this.options.couponCode).val()) {
                $(this.options.couponCode).removeClass('error');
                $(this.options.checkCoupon).removeAttr('disabled');
            } else {
                $(this.options.checkCoupon).attr("disabled", true);
            }
            this.messageCodeError('');
            if (event.keyCode === 13) {
                this.checkCouponCode();
            }
        },

        /**
         * check coupon is auto
         * @returns {*}
         */
        checkCouponCode: function () {
            var self = this,
                couponCode = $.trim($(self.options.couponCode).val()),
                serviceUrl = urlBuilder.build(this.checkUrl);

            self.isCheckCodeValid(false);

            if ($(this.options.checkCouponForm).valid()) {
                this.showLoading(true);
                return $.post(serviceUrl, {coupon_code: couponCode})
                    .done(function (response) {
                        self.showLoading(false);
                        if (response.status) {
                            var couponInValid = [];
                            response.data.forEach(function (item) {
                                if (item.status) {
                                    self.hasWaitingCoupons = true;
                                    $('.show-list-coupon-btn').removeClass('disabled');
                                    self.addValidCoupon(item.coupon);
                                } else {
                                    couponInValid.push(item.coupon_code);
                                }
                            });
                            if (couponInValid.length > 0) {
                                self.isCheckCodeValid(true);
                                var joinCombinedSuccess = couponInValid.map(function (x) {
                                    return '"' + x + '"';
                                });
                                if (couponInValid.length > 1) {
                                    self.messageCodeError($.mage.__('The coupon codes %1 is invalid.').replace('%1', joinCombinedSuccess.join(', ')));
                                } else {
                                    self.messageCodeError($.mage.__('The coupon code %1 is invalid.').replace('%1', joinCombinedSuccess.join(', ')));
                                }
                                self.showErrorManualInput();
                            }
                        } else {
                            self.isCheckCodeValid(true);
                            self.messageCodeError($.mage.__('The coupon code "%1" is invalid.').replace('%1', couponCode));
                            self.showErrorManualInput();
                        }
                    }).fail(function () {
                        self.showLoading(false);
                        self.isCheckCodeValid(true);
                        self.messageCodeError($.mage.__('The coupon code "%1" is invalid.').replace('%1', couponCode));
                        self.showErrorManualInput();
                    });
            }
        },

        showErrorManualInput: function () {
            $(this.options.checkCoupon).attr("disabled", true);
            $(this.options.couponCode).addClass('error');
        },

        /**
         * Event checkbox coupon has select
         */
        checkedCoupon: function (coupon) {
            if (coupon !== null) {
                var self = this;
                var isSelected = coupon.is_check_coupon();
                coupon.is_check_coupon(!isSelected);

                var listCouponSelect = this.coupons.filter(function (coupon) {
                    return coupon.is_check_coupon();
                });

                if (listCouponSelect.length === 2
                    && listCouponSelect[0].combinable_coupons == 0
                    && listCouponSelect[1].combinable_coupons == 0) {
                    coupon.is_check_coupon(false);
                    return;
                }

                var hasCombinable = "";
                for (var key in listCouponSelect) {
                    if (listCouponSelect[key].combinable_coupons == 0) {
                        hasCombinable = listCouponSelect[key].coupon_id;
                        break;
                    }
                }
                if (hasCombinable != "") {
                    for (var i = 0; i < listCouponSelect.length; i++) {
                        if (listCouponSelect[i].combinable_coupons == 0 && listCouponSelect[i].coupon_id == hasCombinable) {
                            listCouponSelect[i].is_check_coupon(true);
                        } else {
                            listCouponSelect[i].is_check_coupon(false);
                        }
                    }
                }
            }
        },

        /**
         * Apply selected coupon
         * @param coupon
         * @param manualInput
         */
        applySingleCoupon: function (coupon, manualInput = false) {
            this.checkedCoupon(coupon);
            if (this.isMobile() && manualInput === false) {
                return;
            }
            this.applyListCoupon(manualInput);
        },

        /**
         * Apply all selected coupons
         * @returns {*}
         */
        applyListCoupon: function (manualInput = false) {
            var self = this;
            var listCouponSelect = self.coupons.filter(function (coupon) {
                return coupon.is_check_coupon();
            }).map(function (m) {
                return {
                    code: m.code,
                    rule_id: m.rule_id,
                    sort_order: m.sort_order,
                    coupon_id: m.coupon_id,
                    is_new: 1
                }
            });
            self.isCheckCodeValid(false);

            if (this.expandedCouponList === false && manualInput) {
                listCouponSelect = window.listCouponApplied.concat(listCouponSelect);
            }

            if (listCouponSelect.length > 0) {
                var serviceUrl = urlBuilder.build(self.applyCouponUrl);
                this.showLoading(true);
                self.messageCodeError('');

                return $.post(serviceUrl, {
                    list_coupon: listCouponSelect,
                    postcode: pinCode.getPincode()
                }).done(function (response) {
                    self.showLoading(false);
                    if (response.status) {
                        if (self.expandedCouponList === false && manualInput === false) {
                            self.showListCoupon();
                        }
                        if (self.isMobile() && manualInput === false) {
                            $(self.options.listCoupon).modal('closeModal');
                        }
                        $(self.options.couponCode).val('');
                        $(self.options.checkCoupon).attr("disabled", true);
                        document.dispatchEvent(new CustomEvent('coupon-updated'));
                    } else {
                        self.reloadListCoupon();
                        self.isCheckCodeValid(true);
                        var combinedError = response.data.combinedError;

                        if (combinedError !== undefined && combinedError.length > 0) {
                            var joinCombinedError = combinedError.map(function (x) {
                                return '"' + x + '"';
                            });
                            if (combinedError.length > 1) {
                                self.renderErrorMessageApply($.mage.__('Cannot combine coupons %1.').replace('%1', joinCombinedError.join(', ')));
                            } else {
                                self.renderErrorMessageApply($.mage.__('The coupon code %1 is invalid.').replace('%1', joinCombinedError.join(', ')))
                            }
                        }

                        if (combinedError.length === 0) {
                            self.renderErrorMessageApply($.mage.__('We cannot apply the coupon code.'));
                        }
                    }
                }).fail(function () {
                    self.reloadListCoupon();
                    self.renderErrorMessageApply($.mage.__('We cannot apply the coupon code.'));
                    self.showLoading(false);
                });
            }
        },

        renderErrorMessageApply: function (message) {
            if (this.isMobile()) {
                this.messageCodeErrorModal(message);
                return;
            }
            this.messageCodeError(message);
        },

        reloadListCoupon: function () {
            this.expandedCouponList = false;
            this.showListCoupon();
        },

        /**
         * Remove coupon applied by MultiCouponid
         */
        removeSingleCoupon: function (coupon, fromList) {
            this.checkedCoupon(coupon);
            this.messageCodeError('');
            this.messageCodeErrorModal('');

            if (this.isMobile() && fromList === true) {
                return;
            }

            document.dispatchEvent(new CustomEvent('remove-coupon', {detail: {'coupon': coupon}}));
        },

        /**
         * Init event
         */
        initEvent: function () {
            let self = this;
            document.addEventListener('remove-coupon-success', function (e) {
                ko.utils.arrayForEach(self.coupons(), function (coupon) {
                    if (coupon.code === e.detail.coupon.coupon_code) {
                        if (coupon.is_check_coupon()) {
                            coupon.is_check_coupon(false);
                        }

                        return false;
                    }
                });
                document.dispatchEvent(new CustomEvent('coupon-updated'));
            });
            document.addEventListener('remove-coupon-fail', function (e) {
                self.messageCodeError($.mage.__('System error.'));
                ko.utils.arrayForEach(self.coupons(), function (coupon) {
                    if (coupon.code === e.detail.coupon.coupon_code) {
                        if (coupon.is_check_coupon() === false) {
                            coupon.is_check_coupon(true);
                        }
                        return false;
                    }
                })
            });
            document.addEventListener('list-apply-synced', function (e) {
                self.updateDropdownText();
            })
        },

        /**
         * Load message after applied coupon
         */
        loadMessage: function () {
            var message = localStorage.getItem('multi_coupon_message');
            if (message !== null && message !== undefined) {
                message = JSON.parse(message);
                var combinedError = message.combinedError;
                var combinedSuccess = message.combinedSuccess;
                if (combinedError !== undefined && combinedError.length > 0) {
                    var joinCombinedError = combinedError.map(function (x) {
                        return '"' + x + '"';
                    });

                    if (combinedError.length > 1) {
                        $('#maincontent div[class*="messages"]:first').append('<div class="message message-error error"><div data-ui-id="checkout-cart-validationmessages-message-error">' + $.mage.__('The coupon codes %1 is invalid.').replace('%1', joinCombinedError.join(', ')) + '</div></div>');
                    } else {
                        $('#maincontent div[class*="messages"]:first').append('<div class="message message-error error"><div data-ui-id="checkout-cart-validationmessages-message-error">' + $.mage.__('The coupon code %1 is invalid.').replace('%1', joinCombinedError.join(', ')) + '</div></div>');
                    }
                }
                if (combinedSuccess !== undefined && combinedSuccess.length > 0) {
                    var joinCombinedSuccess = combinedSuccess.map(function (x) {
                        return '"' + x + '"';
                    });

                    if (combinedSuccess.length > 1) {
                        $('#maincontent div[class*="messages"]:first').append('<div class="message-success success message"><div data-ui-id="checkout-cart-validationmessages-message-success">' + $.mage.__('You used coupon codes %1.').replace('%1', joinCombinedSuccess.join(', ')) + '</div></div>');
                    } else {
                        $('#maincontent div[class*="messages"]:first').append('<div class="message-success success message"><div data-ui-id="checkout-cart-validationmessages-message-success">' + $.mage.__('You used coupon code %1.').replace('%1', joinCombinedSuccess.join(', ')) + '</div></div>');
                    }
                }
                localStorage.removeItem('multi_coupon_message');
            }
        },

        /**
         * Show list coupon to apply
         */
        showListCoupon: function () {
            this.messageCodeError('');
            this.messageCodeErrorModal('');
            if (this.isMobile()) {
                this.initModalListCoupon();
                this.getListCoupon();
                $(this.options.listCoupon).modal('openModal');
                return;
            }
            if (!this.expandedCouponList) {
                if (window.listCouponApplied.length === 0 && !this.hasWaitingCoupons) {
                    return;
                }
                $(this.options.sectionCoupon).find('.wrap-coupon').show();
                $(this.options.blockDiscount).addClass("discount--open");
                this.expandedCouponList = true;
            } else {
                $(this.options.sectionCoupon).find('.wrap-coupon').hide();
                $(this.options.blockDiscount).removeClass("discount--open");
                this.expandedCouponList = false;
            }
        },

        /**
         * Setup modal for coupon list
         */
        initModalListCoupon: function () {
            var self = this;
            var modalOption = {
                type: 'popup',
                title: $.mage.__('Select Coupon'),
                modalClass: 'multi-coupon-modal',
                responsive: true,
                clickableOverlay: true,
                buttons: [{
                    text: $.mage.__('Apply'),
                    class: 'action primary checkout',
                    click: function () {
                        self.applyListCoupon();
                    }
                }]
            };
            $(self.options.listCoupon).modal(modalOption);
            $(self.options.listCoupon).parents('div.modal-inner-wrap').addClass('coupon-list-responsivev2');
        },

        /**
         * observable for disable and checked box coupon
         */
        rebuildCouponObservable: function () {
            this.coupons.some(function (coupon) {
                coupon.is_disable = ko.observable(coupon.is_disable);
                coupon.is_check_coupon = ko.observable(coupon.is_check_coupon);
            });
        },

        /**
         * Get list coupon for user or guest
         * @returns {*}
         */
        getListCoupon: function (forceAddCoupon = null) {
            var self = this;
            var serviceUrl = urlBuilder.build(self.listCouponUrl);
            this.showLoading(true);
            self.coupons.removeAll();
            self.isCheckCodeValid(false);
            $(self.options.couponCode).val('');
            return $.get(serviceUrl)
                .done(function (response) {
                    self.showLoading(false);
                    if (response.status) {
                        response.coupons.some(function (coupon) {
                            coupon.is_disable = ko.observable(coupon.is_disable);
                            coupon.is_check_coupon = ko.observable(coupon.is_check_coupon);
                            self.coupons.push(coupon);
                        });
                        if (self.coupons._latestValue.length > 0) {
                            self.hasWaitingCoupons = true;
                            $('.show-list-coupon-btn').removeClass('disabled');
                        }
                    }
                    self.checkedCoupon(null);
                    if (forceAddCoupon) {
                        self.addValidCoupon(forceAddCoupon, true);
                    }
                    $(self.options.listCoupon).parents('aside').find('.action-close').blur();
                }).fail(function () {
                    self.showLoading(false);
                });
        },

        /**
         * @returns {*}
         */
        updateDropdownText: function () {
            switch (window.listCouponApplied.length) {
                case 0:
                    this.dropdownText($.mage.__('Select Coupon'));
                    $(this.options.blockDiscount).find('.selectBox').removeClass('multicoupon');
                    break;
                case 1:
                    this.dropdownText($.mage.__('1 coupon is applied'));
                    $(this.options.blockDiscount).find('.selectBox').addClass('multicoupon');
                    return;
                default:
                    this.dropdownText($.mage.__('%1 coupons are applied').replace('%1', window.listCouponApplied.length));
            }
        },

        /**
         * Detect Mobile screen
         * @returns {boolean}
         */
        isMobile: function () {
            return false; /* not use function show coupon lists popup at mobile */
        },

        /**
         * Contuctor
         * @param config
         */
        initialize: function (config) {
            this._super();
            this.observe([
                'coupons'
            ]);

            this.rebuildCouponObservable();
            this.isGuest = config.isGuest;
            this.coupons = ko.observableArray([]);
            this.updateDropdownText();
            this.initEvent();
            this.loadMessage();
            this.getListCoupon();
            if (window.listCouponApplied.length > 0) {
                this.hasWaitingCoupons = true;
                setTimeout(function(){
                    $("#action-apply-coupon").addClass("multicoupon");
                },1000);
            }
        },

        /**
         * Show list coupon to apply when has referrer coupon.
         */
        checkReferrerCoupon: function () {
            if (this.hasReferrerCoupon) {
                this.showListCoupon();
            }
        }
    });
});
