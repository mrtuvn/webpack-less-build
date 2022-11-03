/**
 * Copyright © 2018 CyberSource. All rights reserved.
 * See LICENSE.txt for license details.
 */
/*browser:true*/
/*global define*/
define(
    [
        'jquery',
        'CyberSource_SecureAcceptance/js/view/payment/cc-form',
        'Magento_Checkout/js/action/set-payment-information',
        'Magento_Checkout/js/model/payment/additional-validators',
        'Magento_Checkout/js/model/quote',
        'Magento_Customer/js/customer-data',
        'Magento_Vault/js/view/payment/vault-enabler',
        'Magento_Checkout/js/model/full-screen-loader',
        'Magento_Ui/js/model/messageList',
        'mage/url',
        'Magento_Payment/js/model/credit-card-validation/validator',
        'jquery/ui',
        'mage/translate'
    ],
    function (
        $,
        Component,
        setPaymentInformationAction,
        additionalValidators,
        quote,
        customerData,
        VaultEnabler,
        fullScreenLoader,
        globalMessageList,
        urlBuilder
    ) {
        'use strict';

        return Component.extend({
            defaults: {
                active: false,
                template: 'CyberSource_SecureAcceptance/payment/form',
                code: 'chcybersource',
                imports: {
                    onActiveChange: 'active'
                }
            },
            /**
             * @returns {exports.initialize}
             */
            initialize: function () {
                this._super();
                this.vaultEnabler = new VaultEnabler();
                this.vaultEnabler.setPaymentCode(this.getVaultCode());

                return this;
            },
            initObservable: function () {
                this._super()
                    .observe(['active']);
                return this;
            },

            getCode: function () {
                return this.code;
            },

            getVaultCode: function () {
                return window.checkoutConfig.payment[this.getCode()].vaultCode;
            },
            hasVerification: function () {
                return !window.checkoutConfig.payment[this.getCode()].ignore_cvn;
            },
            /**
             * @returns {Object}
             */
            getData: function () {
                var data = this._super();

                this.vaultEnabler.visitAdditionalData(data);

                return data;
            },

            getCcAvailableTypesValues: function () {
                return _.map(this.getCcAvailableTypes(), function (value, key) {
                    return {
                        'value': key,
                        'type': value
                    };
                });
            },

            getCcAvailableTypes: function () {
                return window.checkoutConfig.payment.ccform.availableTypes[this.getCode()];
            },

            isVaultEnabled: function () {
                return this.vaultEnabler.isVaultEnabled();
            },

            isActive: function () {
                var active = this.getCode() === this.isChecked();

                this.active(active);

                return active;
            },

            getTitle: function () {
                return window.checkoutConfig.payment[this.getCode()].title;
            },

            isSilentPost: function() {
                return window.checkoutConfig.payment[this.getCode()].silent_post;
            },

            isIFrameEnabled: function () {
                return window.checkoutConfig.payment[this.getCode()].use_iframe;
            },
            isIframeSandboxEnabled: function () {
                return window.checkoutConfig.payment[this.getCode()].use_iframe_sandbox;
            },
            getSelector: function (field) {
                return '#' + this.getCode() + '_' + field;
            },

            validate: function () {
                var $form = $(this.getSelector('form'));
                return $form.validation() && $form.validation('isValid');
            },

            placeOrderToCyberSource: function () {
                fullScreenLoader.startLoader();

                if (this.isSilentPost()) {
                    this.placeOrderWithSOP();
                } else {
                    this.placeOrderWithWebMobile();
                }
            },

            placeOrderWithSOP: function() {
                var queryString = {form_key: $.cookie('form_key')},
                    form = $('#cybersource-post-form');

                if (!(this.validate() && additionalValidators.validate())) {
                    fullScreenLoader.stopLoader();
                    return false;
                }

                if (quote.guestEmail) {
                    queryString.quoteEmail = quote.guestEmail;
                }

                queryString.cardType = $(this.getSelector('cc_type')).val();
                if ($(this.getSelector('enable_vault')).is(":checked")) {
                    queryString.vaultIsEnabled = 1;
                }

                this.card_number = this.createHiddenInput('card_number', $(this.getSelector('cc_number')).val() );
                this.card_expiry_date = this.createHiddenInput(
                    'card_expiry_date',
                    ("0" + $(this.getSelector('expiration')).val()).slice(-2) + '-' + $(this.getSelector('expiration_yr')).val()
                );
                this.card_cvn = this.createHiddenInput ('card_cvn', $(this.getSelector('cc_cid')).val());

                this.selectPaymentMethod();

                $.when(
                    setPaymentInformationAction(this.messageContainer, {method: this.getCode()})
                ).then(
                    function () {
                        return $.ajax({
                            url: urlBuilder.build("cybersource/index/loadsilentdata"),
                            type: "get",
                            data: queryString,
                            dataType: 'json',
                            showLoader: true
                        })
                    }
                ).done(
                    function (data) {
                        if (!data || data.error) {
                            return this.handleError(data);
                        }

                        form.attr('action', data.action_url);
                        form.append(this.card_number);
                        form.append(this.card_expiry_date);
                        form.append(this.card_cvn);

                        for (var name in data.form_data) {
                            form.append(this.createHiddenInput(name, data.form_data[name]));
                        }

                        form.submit();

                    }.bind(this)
                ).fail(
                    function () {
                        fullScreenLoader.stopLoader();
                    }
                );
            },

            placeOrderWithWebMobile: function () {
                var queryString = {form_key: $.cookie('form_key')};

                if (!additionalValidators.validate()) {
                    fullScreenLoader.stopLoader();
                    return;
                }

                if (this.isIFrameEnabled()) {
                    return this.getIFrame();
                }

                queryString.quoteEmail = quote.guestEmail;
                if ($(this.getSelector('enable_vault')).is(":checked")) {
                    queryString.vaultIsEnabled = 1;
                }

                this.selectPaymentMethod();

                $.when(
                    setPaymentInformationAction(this.messageContainer, {method: this.getCode()})
                ).then(
                    function () {
                        return $.ajax({
                            url: urlBuilder.build("cybersource/index/loadinfo"),
                            type: "post",
                            dataType: 'json',
                            data: queryString
                        })
                    }
                ).done(
                    function (data) {

                        if (!data || data.error) {
                            return this.handleError(data);
                        }

                        var form = $("#cybersource-post-form");
                        $(form).attr("action", data['request_url']);

                        for (var k in data) {
                            if (k !== 'request_url') {
                                form.append(this.createHiddenInput(k, data[k]));
                            }
                        }

                        $("body").append(form);
                        form.submit();
                    }.bind(this)
                ).always(
                    function () {
                        fullScreenLoader.stopLoader();
                    }
                );

            },

            getIFrame: function () {
                var queryString = {form_key: $.cookie('form_key')}, that = this;
                queryString.quoteEmail = quote.guestEmail;
                if ($(this.getSelector('enable_vault')).is(":checked")) {
                    queryString.vaultIsEnabled = 1;
                }

                var loading = '<div id="cybersource-modal-content" style="width: 500px; padding: 0;position: fixed;z-index: 9999;margin: 0 auto;left: 0;right: 0; top:0">' +
                    '<div id="cybersource-modal-modal-child" style="position: relative; background-color: #fff;">' +
                    '<div style="width:100%;text-align:right;">' +
                    '<a href="" id="cybersource-close-iframe">X</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                if (document.getElementById('cybersource-view-detail-processing-modal')) {
                    $('#cybersource-view-detail-processing-modal').remove();
                }
                if (!$('.loading-mask')) {
                    $('body').append('<div class="loading-mask"></div>');
                }
                if (!document.getElementById('cybersource-view-detail-processing-modal')) {
                    var overlay = $(document.createElement('div'));
                    $(overlay).attr('id', 'cybersource-view-detail-processing-modal');
                    overlay.append(loading);
                    $('body').append(overlay);

                    $.when(
                        setPaymentInformationAction(this.messageContainer, {method: this.getCode()})
                    ).then(
                        function () {
                            return $.ajax({
                                url: urlBuilder.build("cybersource/index/loadiframe"),
                                type: "post",
                                dataType: 'json',
                                data: queryString
                            })
                        }
                    ).done(
                        function (data) {
                            if (!data || data.error) {
                                return that.handleError(data);
                            }
                            var iframe = document.createElement('iframe');
                            var modal = document.getElementById("cybersource-modal-modal-child");
                            iframe.onload = function () {
                                try {
                                    var form = iframe.contentWindow.document.getElementById('cybersource-iframe-form');
                                    $(form).submit();
                                } catch (err) {
                                }
                            };
                            modal.appendChild(iframe);
                            iframe.contentWindow.document.open();
                            iframe.contentWindow.document.write(data.html);
                            iframe.contentWindow.document.close();
                            var el = $(iframe);
                            el.attr('id', "cybersource-frame");
                            el.css("width", "100%");
                            el.css("height", "650px");
                            el.css("border", "#ccc 1px solid");

                            $(window).resize(that.updateIframePosition.bind(that));
                            that.updateIframePosition.bind(that)();

                            if (that.isIframeSandboxEnabled()) {
                                el.attr('sandbox', "allow-top-navigation allow-scripts allow-forms");
                            }
                        }
                    ).always(
                        function () {
                            fullScreenLoader.stopLoader();
                        }
                    );

                    $('#cybersource-close-iframe').click(function () {
                        $('#cybersource-view-detail-processing-modal').remove();
                        $('.loading-mask').hide();
                        return false;
                    });
                }
            },
            updateIframePosition: function () {
                var iframe_width = ($(window).width() < 500) ? $(window).width() : 500;
                var iframe_height = (document.documentElement.clientHeight / 2) - 325;
                iframe_height = iframe_height < 30 ? 30 : iframe_height;
                $("#cybersource-modal-modal-child").css({top: iframe_height, width: iframe_width});
            },
            createHiddenInput: function (name, value) {
                return $('<input type="hidden" />').attr('name', name).attr('value', value );
            },
            handleError: function (data) {
                var message = (data && data.error) ? data.error :  $.mage.__('An error occurred.');
                this.messageContainer.addErrorMessage({message: message});
                fullScreenLoader.stopLoader();
            }
        });
    }
);
