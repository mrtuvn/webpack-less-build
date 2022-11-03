define([
    'jquery',
    'Lg_Theme/js/cart',
    'Magento_Ui/js/modal/alert',
    'slick',
    'scrollbar'
], function ($, cart, mageAlert) {
    'use strict';
    /* custom version from origin module Lg_Theme. This file will override module js file . Add some js for frontend styling */
    /* Apply for all child of common v2 themes */
    return function (options) {
        var init = function (token) {

            // ajax default send type setting
            var commonSendType = 'post';
            if (location.port == "3000") commonSendType = 'get';

            window.browse_check = function () {
                if (!document.getElementById("modal_browse_supported_guide")) return false;

                var browser_ver = navigator.userAgent,
                    filter = /(msie) [2-9]/i;

                var _this = window.browse_check,
                    layer = {
                        popup_layer: document.getElementById("modal_browse_supported_guide"),
                        popup_back_layer: document.getElementById("modal-background"),
                        popup_close: document.getElementById("modal-layer-close")
                    },
                    classSet = {
                        activate: "active",
                        popup_layer: "broswe-check-popup-layer",
                        popup_back_layer: "modal-background"
                    };

                _this.init = function () {
                    if (browser_ver.search(filter) !== -1) {
                        console.log("ie lower case");
                        _this.layer_active();
                    }
                    _this.addEvent();
                };

                _this.addEvent = function () {
                    layer.popup_back_layer.onclick = function () {
                        _this.layer_close();
                    };
                    layer.popup_close.onclick = function () {
                        _this.layer_close();
                    };
                };

                _this.layer_active = function () {
                    layer.popup_layer.className = classSet.popup_layer + " " + classSet.activate;
                    layer.popup_back_layer.className = classSet.popup_back_layer + " " + classSet.activate;
                };

                _this.layer_close = function () {
                    if (layer.popup_layer.className.indexOf("active") > 1) {
                        layer.popup_layer.className = classSet.popup_layer;
                        layer.popup_back_layer.className = classSet.popup_back_layer;
                    }
                };
                _this.init();
            };
            window.browse_check();

// Scripts that prevent users from entering script code
            window.xssfilter = function (content, isHTML) {
                if(typeof content == 'string' || isHTML) {
                    // Do not change the running order below.
                    var returnTxt =  content.replace(/%3C/g, '').replace(/%3E/g, '') // <와 > 삭제 (for url)
                        .replace(/javascript%3A/gi, '') // javascript: 을 삭제 (for url, 대소문자 구분없이)
                        .replace(/%22/g, '').replace(/%27/g, '') // "와 '를 삭제 (for url)
                        .replace(/¼/g, '<').replace(/¾/g, '>')
                        .replace(/\+ADw\-/g, '<').replace(/\+AD4\-/g, '>')
                        .replace(/\0/gi, ' ').replace(/&#x09;/g, '').replace(/&#x0A;/g, '').replace(/&#x0D;/g, '') // 공백 대체 문자 제거
                        .replace(/j( *	*\\*<*>*|\/\*.*\*\/)a( *	*\\*<*>*|\/\*.*\*\/)v( *	*\\*<*>*|\/\*.*\*\/)a( *	*\\*<*>*|\/\*.*\*\/)s( *	*\\*<*>*|\/\*.*\*\/)c( *	*\\*<*>*|\/\*.*\*\/)r( *	*\\*<*>*|\/\*.*\*\/)i( *	*\\*<*>*|\/\*.*\*\/)p( *	*\\*<*>*|\/\*.*\*\/)t( *	*\\*<*>*|\/\*.*\*\/):/gi, '') // javascript: 제거 (대소문자 구분 없이)
                        .replace(/v( *	*\\*<*>*|\/\*.*\*\/)b( *	*\\*<*>*|\/\*.*\*\/)s( *	*\\*<*>*|\/\*.*\*\/)c( *	*\\*<*>*|\/\*.*\*\/)r( *	*\\*<*>*|\/\*.*\*\/)i( *	*\\*<*>*|\/\*.*\*\/)p( *	*\\*<*>*|\/\*.*\*\/)t( *	*\\*<*>*|\/\*.*\*\/):/gi, '') // vbscript: 제거 (대소문자 구분 없이)
                        .replace(/l( *	*\\*<*>*|\/\*.*\*\/)i( *	*\\*<*>*|\/\*.*\*\/)v( *	*\\*<*>*|\/\*.*\*\/)e( *	*\\*<*>*|\/\*.*\*\/)s( *	*\\*<*>*|\/\*.*\*\/)c( *	*\\*<*>*|\/\*.*\*\/)r( *	*\\*<*>*|\/\*.*\*\/)i( *	*\\*<*>*|\/\*.*\*\/)p( *	*\\*<*>*|\/\*.*\*\/)t( *	*\\*<*>*|\/\*.*\*\/):/gi, '') // livescript: 제거 (대소문자 구분 없이)
                        .replace(/e( *	*\\*<*>*|\/\*.*\*\/)x( *	*\\*<*>*|\/\*.*\*\/)p( *	*\\*<*>*|\/\*.*\*\/)r( *	*\\*<*>*|\/\*.*\*\/)e( *	*\\*<*>*|\/\*.*\*\/)s( *	*\\*<*>*|\/\*.*\*\/)s( *	*\\*<*>*|\/\*.*\*\/)i( *	*\\*<*>*|\/\*.*\*\/)o( *	*\\*<*>*|\/\*.*\*\/)n( *	*\\*<*>*|\/\*.*\*\/)\(/gi, '') // expression( 제거 (대소문자 구분 없이)
                        .replace(/&#[x]*[0-9]+/gi, '.') // encoding 방지
                        .replace(/<script.+\/script>/gi, '') // script로 시작해서 /script로 끝나는 태그 제거 (대소문자 구분없이)
                        .replace(/String\.fromCharCode/gi, '')
                        .replace(/Set\.constructor/gi, '')
                        .replace(/FSCommand/gi, '')
                        .replace(/seekSegmentTime/gi, '')
                        .replace(/eval\(/gi, '')
                        .replace(/window\.on.+/gi, '')
                    ;

                    // tag
                    returnTxt = returnTxt.replace(/<link./gi, '').replace(/<\/link>/gi, '')
                        .replace(/<script./gi, '').replace(/<\/script>/gi, '')
                        .replace(/<style./gi, '').replace(/<\/style>/gi, '')
                        .replace(/<meta./gi, '').replace(/<\/meta>/gi, '')
                        .replace(/<object./gi, '').replace(/<\/object>/gi, '')
                        .replace(/<embed./gi, '').replace(/<\/embed>/gi, '')
                        .replace(/<iframe./gi, '').replace(/<\/iframe>/gi, '')
                        .replace(/<applet./gi, '').replace(/<\/applet>/gi, '')
                        .replace(/<base./gi, '').replace(/<\/base>/gi, '')
                        .replace(/<frameset./gi, '').replace(/<\/frameset>/gi, '')
                        .replace(/<xml./gi, '').replace(/<\/xml>/gi, '')
                    ;

                    // form, input
                    if(isHTML=='form') {
                        returnTxt = returnTxt.replace(/(\%20| |	|\\|\/|\"|\'|\.)+on[a-z]+\=/gi, '');
                        returnTxt = returnTxt.replace(/\(/g, '').replace(/\)/g, '');
                    } else {
                        returnTxt = returnTxt.replace(/(\%20|	|\\|\/|\"|\'|\.)+on/gi, '&#111;n');
                    }

                    // <와 > 제거
                    if(!isHTML || isHTML=='form') {
                        returnTxt = returnTxt.replace(/</g, '').replace(/>/g, '')
                            .replace(/&lt/gi, '').replace(/&gt/gi, '')
                        ;
                    }

                    //console.log('XSS :', typeof content, content, returnTxt);
                    return returnTxt;
                } else if (typeof content == 'object') {
                    $.each(content, function(key, value) {
                        content[key]=window.xssfilter(value);
                    });
                    return content;
                } else {
                    return content;
                }
            };

// adobe
            window.getStepProductCode = function() {
                var code;
                if($('#modelSummary').length>0) code = $('#modelSummary').data('adobe-salesmodelcode');
                if(!code) code='';
                return code;
            }
            window.changeTitleFormat = function(title) {
                // Please do not modify any spaces in the code below.
                return $.trim(title.toLowerCase().replace(/[^a-z0-9_ ]/gi, "")).replace(/ /gi, "_").replace(/_+/gi, "_");
            }


            /* START dummy functions used on local */

            // window._trackEvent = function(e) {
            //     console.log('_trackEvent Function: ', e);
            // };

            /* END dummy functions used on local */

            window.adobeSatellite = function(name, param) {
                console.log('adobe code : ' + name, param);
                if (typeof _satellite.track == 'function' && _dl) {
                    _satellite.track(name, param);
                }
            };
            // Get data _dl in checkout success page
            // window._dl = {};
            window.adobeTrackEvent = function(name, param) {
                console.log('adobe code : ' + name, param);
                if (typeof _trackEvent == 'function' && _dl) {
                    _trackEvent(
                        $.extend(_dl, param)
                    );
                }
            };

            window.findModelName = function($obj) {
                var va = $obj.closest('.item').find('a.visual[data-adobe-modelname]').data('adobe-modelname'); // for product list
                if (!va) va = $obj.closest('.bundle').find('a[data-adobe-modelname]').data('adobe-modelname'); // for C0006
                if (!va) va = $obj.closest('.C0009').data('adobe-modelname'); // for C0009
                if (!va) va = $obj.closest('.C0023').find('.model-info').data('adobe-modelname'); // for C0023
                if (!va) va = $obj.closest('.item').find('.img a[data-adobe-modelname]').data('adobe-modelname'); // for C0058
                if (!va) va = $obj.closest('li').find('.txt > a').data('adobe-modelname'); // for gnb search
                // for C0011
                if (!va && $obj.closest('.C0011').length>0){
                    va = $('.C0009').data('adobe-modelname');
                }
                if (!va || va=="undefined") va = '';
                console.log('	adobe-modelName:', va);
                return va;
            }

            window.findSalesModelCode = function($obj) {
                var va = $obj.closest('.item').find('a.visual[data-adobe-salesmodelcode]').data('adobe-salesmodelcode'); // for product list
                if (!va) va = $obj.closest('.bundle').find('a[data-adobe-salesmodelcode]').data('adobe-salesmodelcode'); // for C0006
                if (!va) va = $obj.closest('.C0009').data('adobe-salesmodelcode'); // for C0009
                if (!va) va = $obj.closest('.C0023').find('.model-info').data('adobe-salesmodelcode'); // for C0023
                if (!va) va = $obj.closest('.item').find('.img a[data-adobe-salesmodelcode]').data('adobe-salesmodelcode'); // for C0058
                if (!va) va = $obj.closest('li').find('.txt > a').data('adobe-salesmodelcode'); // for gnb search
                // for C0011
                if (!va && $obj.closest('.C0011').length>0){
                    va = $('.C0009').data('adobe-salesmodelcode');
                }
                if (!va || va=="undefined") va = '';
                console.log('	adobe-salesModelCode:', va);
                return va;
            }

            window.findPrice = function($obj) {
                var va = $obj.closest('.item').find('.products-info .price-area .purchase-price .price').text(); // for product list, mylg > my product
                if (!va) va = $obj.closest('.bundle').find('.purchase-price .price').text(); // for C0006
                if (!va) va = $obj.closest('.pdp-info').find('.price-area .purchase-price .price').text(); // for pdp summary (C0009)
                if (!va) va = $obj.closest('.model-info').find('.selling-price').text(); // for C0023
                if (!va) va = $obj.closest('.item').find('.price-area .purchase-price .price').text(); // for C0058
                if (!va) va = $obj.closest('li').find('.hidden-price').text(); // for gnb search
                // for C0011
                if (!va && $obj.closest('.C0011').length>0){
                    va = $('.C0009').find('.pdp-info').find('.price-area .purchase-price').eq(0).find('.price').text();
                }
                if (!va || va=="undefined") va = '';
                va = va.replace(/[\{\}\[\]\/?,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, '');
                va = Number(va);
                console.log('	adobe-price:', va);
                return va;
            }
            window.findModelCount = function($obj) {
                var va = 1;
                if($obj.closest('.C0010').length>0) num = $obj.closest('.C0010').find('.selected-items .selected-number .number').text();
                console.log('	adobe-count:', va);
                return va;
            }
            $('body').on('click', '.where-to-buy', function () {
                window.adobeTrackEvent('where-to-buy', {
                    products: [{sales_model_code : findSalesModelCode($(this)), model_name: findModelName($(this))}],
                    page_event: {where_to_buy_click: true}
                });
            });
            $('body').on('click', '.inquiry-to-buy', function () {
                window.adobeTrackEvent('inquiry-to-buy', {
                    products: [{sales_model_code : findSalesModelCode($(this)), model_name: findModelName($(this))}],
                    page_event: {inquiry_to_buy_click: true}
                });
            });
            $('body').on('click', '.find-a-dealer', function () {
                window.adobeTrackEvent('find-a-dealer', {
                    products: [{sales_model_code : findSalesModelCode($(this)), model_name: findModelName($(this))}],
                    page_event: {find_a_dealer_click: true}
                });
            });

// for responsive
            window.mql = {
                maxXs: window.matchMedia('(max-width: 575px)'),
                minSm: window.matchMedia('(min-width: 576px)'),
                sm: window.matchMedia('(min-width: 576px) and (max-width: 767px)'),
                maxSm: window.matchMedia('(max-width: 767px)'),
                minMd: window.matchMedia('(min-width: 768px)'),
                md: window.matchMedia('(min-width: 768px) and (max-width: 991px)'),
                maxMd: window.matchMedia('(max-width: 991px)'),
                minLg: window.matchMedia('(min-width: 992px)'),
                maxLg: window.matchMedia('(max-width: 1199px)'),
                lg: window.matchMedia('(min-width: 992px) and (max-width: 1199px)'),
                minXl: window.matchMedia('(min-width: 1200px)')
            };
// Slick arrow html
            window.carouselOptions = {
                squarePrev: '<button type="button" class="slick-prev type-square">Previous</button>',
                squareNext: '<button type="button" class="slick-next type-square">Next</button>',
                bigAnglePrev: '<button type="button" class="slick-prev">Previous <i class="icon"><svg width="23px" height="40px"><path fill-rule="evenodd" fill="currentColor" d="M21.577,2.477 L3.668,19.984 L21.577,37.491 C22.160,38.061 22.160,38.985 21.577,39.555 C20.994,40.126 20.048,40.126 19.465,39.555 L0.726,21.238 C0.634,21.181 0.534,21.140 0.454,21.061 C0.150,20.764 0.013,20.373 0.025,19.984 C0.013,19.595 0.150,19.204 0.454,18.907 C0.535,18.828 0.635,18.786 0.728,18.729 L19.465,0.412 C20.048,-0.158 20.994,-0.158 21.577,0.412 C22.160,0.983 22.160,1.908 21.577,2.477 Z"/></svg></i></button>',
                bigAngleNext: '<button type="button" class="slick-next">Next <i class="icon"><svg width="22px" height="40px"><path fill-rule="evenodd" fill="currentColor" d="M21.546,21.061 C21.466,21.140 21.366,21.181 21.274,21.238 L2.535,39.555 C1.952,40.126 1.006,40.126 0.423,39.555 C-0.161,38.985 -0.161,38.061 0.423,37.491 L18.332,19.984 L0.423,2.477 C-0.161,1.908 -0.161,0.983 0.423,0.412 C1.006,-0.158 1.952,-0.158 2.535,0.412 L21.272,18.729 C21.365,18.786 21.465,18.828 21.546,18.907 C21.849,19.204 21.987,19.595 21.975,19.984 C21.987,20.373 21.849,20.764 21.546,21.061 Z"/></svg></i></button>'
            };
// Scripts that convert svg files to online-svg
            window.initSVG = function () {
                $('img.inline-svg').not('.lazyload').inlineSVG({
                    beforeReplace: function ($img, $svg, next) {
                        $svg.find("path").removeAttr("class").removeAttr("id").removeAttr("data-name");
                        $svg.find("defs").remove();
                        next();
                    }
                });
            };
// Get Cookie
            window.getCookie = function (name) {
                if ($.cookie(name)) {
                    return decodeURIComponent($.cookie(name));
                } else {
                    $.cookie(name);
                }
            };
// Save Cookie
            window.setCookie = function (name, val, domainFlag) {
                var lh = location.host;
                var mydomain = '.lg.com';
                if(lh.indexOf('lge.com')>=0) {
                    mydomain = '.lge.com';
                }
                var domain = {};
                if (name=='LG5_B2B_CompareCart' || name=='LG5_CompareCart' || name == 'LG5_RecentlyView' || domainFlag == true) {
                    domain = {
                        path: '/',
                        domain: mydomain
                    };
                }
                if(name=='LG5_SupportSearch' || name=='LG5_RememberAccount' || name=='LG5_RecentlyView' || name=='LG5_CST_RecentlyView') {
                    domain.expires=30;
                }
                $.cookie(name, encodeURIComponent(val), domain);
            };
// Remove Cookie
            window.removeCookie = function (name, domainFlag) {
                var lh = location.host;
                var mydomain = '.lg.com';
                if(lh.indexOf('lge.com')>=0) {
                    mydomain = '.lge.com';
                }
                var domain = {};
                if (name=='LG5_B2B_CompareCart' || name=='LG5_CompareCart' || name == 'LG5_RecentlyView' || domainFlag == true) {
                    domain = {
                        path: '/',
                        domain: mydomain
                    };
                }
                $.removeCookie(name, domain);
            };
// pop-up
            window.winowPop = function () {
                var popup = document.getElementsByClassName('js-popup');
                $(popup).on('click', function (e) {
                    e.preventDefault();
                    var target = this.getAttribute('href'),
                        popupWidth = parseInt(this.getAttribute('data-width')),
                        popupHeight = parseInt(this.getAttribute('data-height')),
                        screenWidth = parseInt(screen.width),
                        screenHeight = parseInt(screen.height),
                        intLeft = Math.floor((screenWidth - popupWidth) / 2),
                        intTop = Math.floor((screenHeight - popupHeight) / 2);

                    if (intLeft < 0) intLeft = 0;
                    if (intTop < 0) intTop = 0;

                    window.open(target, '_blank', 'width=' + popupWidth + ',height=' + popupHeight + ',left=' + intLeft + ',top=' + intTop + ',history=no,resizable=no,status=no,scrollbars=yes,menubar=no');
                });
            };
// tooltip
            window.tooltipActive = function () {
                var tooltip = document.getElementsByClassName('js-tooltip');
                var tooltipClose = document.getElementsByClassName('tooltip-close');

                $(tooltip).on('click', function (e) {
                    e.preventDefault();
                    if ($(this).next('.tooltip-area').css('display') != 'block') {
                        $('.tooltip-area').hide();
                        $(this).next('.tooltip-area').show();
                        // 화면 왼쪽 밖으로 나가는 경우 처리
                        if(parseInt($(this).next('.tooltip-area').offset().left) < 0) {
                            $(this).next('.tooltip-area').addClass('out');
                        }
                    } else {
                        $(this).focus();
                        $(this).next('.tooltip-area').hide();
                    }
                });
                $(tooltipClose).on('click', function (e) {
                    e.preventDefault();
                    $(this).closest('.tooltip-wrap').find('.js-tooltip').focus();
                    $(this).closest('.tooltip-area').hide();
                });
                $(window).resize(function () {
                    $('.tooltip-area').hide();
                }).resize();
            };
// count the number
            window.checkTextLength = function (obj, count) {
                var max = parseInt(obj.attr('maxlength'));
                /*
                obj.on('keyup, input', function () {
                    var type = obj.val().length;
                    var remain = max - type;
                    count.text(remain);
                    var str1 = obj.val();
                    var str2 = "";
                    if (remain <= 1) {
                        str2 = str1.substr(0, max);
                    }
                });
                */
                obj.off('keyup input').on('keyup input', function (e) {
                    var tgField = e.currentTarget;
                    var byteTotal = 0;
                    var tmpByte = 0;
                    var strLen = 0;
                    var c;
                    for (var i = 0; i < tgField.value.length; i++) {
                        c = escape(tgField.value.charAt(i));
                        if (c.length == 1) {
                            tmpByte++;
                        } else if (c.indexOf("%u") != -1) {
                            tmpByte += 2;
                        } else {
                            tmpByte++;
                        }

                        if (tmpByte > max) {
                            strLen = i;
                            break;
                        } else {
                            byteTotal = tmpByte;
                        }
                    }
                    if (strLen) {
                        tgField.value = tgField.value.substring(0, strLen);
                    }
                    count.text(Math.max(0, max-byteTotal));
                });
            };
// browser zoom
            window.getCurrentBrowserZoom = function(){
                if(window.devicePixelRatio) {
                    return window.devicePixelRatio;
                } else {
                    // ie10에서 동작하지 않음, 다른 방법 없는지 확인 필요
                }
            }
// Script to prevent multiple calls of url once called in ajax call
            window.ajax = {
                cacheParams: [],
                cacheDatas: [],
                // default : cached data
                call: function (paramURL, param, type, callback, sType, progressiveTarget) {

                    var dataType = type ? type : 'json';
                    var sendType = sType ? sType : commonSendType;
                    var pTarget = progressiveTarget;
                    var isFormData = param instanceof FormData;

                    var stringParam = param && param != null ? jQuery.param(param) : "";

                    $.ajax({
                        type: sendType,
                        url: paramURL,
                        // async: false,
                        dataType: type,
                        data: xssfilter(param),
                        contentType: isFormData ? false : 'application/x-www-form-urlencoded; charset=UTF-8',
                        processData: isFormData ? false : true,
                        beforeSend: function () {
                            // caching check;
                            var idx = (sendType == 'post') ? ajax.cacheParams.indexOf(this.url + '?' + stringParam) : ajax.cacheParams.indexOf(this.url);
                            if (idx >= 0) {
                                this.data = ajax.cacheDatas[idx];
                                callback(this.data, this);
                                return false;
                            }
                            if (pTarget) {
                                $(pTarget).trigger('ajaxLoadBefore');
                            }
                        },
                        success: function (d) {
                            if (this.dataType == 'json') {
                                if (typeof d === "string") {
                                    d = $.parsejson(d);
                                }
                            }
                            if (d.status != "success" && d.message != null) { // error msg
                                ajax.popupErrorMsg(d.message);
                                d = false;
                            } else { // pass data
                                // check cached data
                                if (sendType == 'post') ajax.cacheParams.push(this.url + '?' + stringParam);
                                else ajax.cacheParams.push(this.url);

                                // caching data
                                ajax.cacheDatas.push(d);

                            }
                            // finish ajax loading
                            if (pTarget) {
                                $(pTarget).trigger('ajaxLoadEnd');
                            }
                            callback(d, this);
                        },
                        error: function (request, status, error) {
                            console.log("status: " + status);
                            console.log("error: " + error);
                            if (pTarget) {
                                $(pTarget).trigger('ajaxLoadEnd');
                            }
                            callback(false, this);
                            ajax.popupErrorMsg(error);
                        }
                    });
                },
                // Scripts used when caching is disabled
                noCacheCall: function (paramURL, param, type, callback, sType, progressiveTarget) {
                    var dataType = type ? type : 'json';
                    var sendType = sType ? sType : commonSendType;
                    var pTarget = progressiveTarget;
                    var isFormData = param instanceof FormData;

                    $.ajax({
                        type: sendType,
                        url: paramURL,
                        // async: false,
                        dataType: type,
                        data: xssfilter(param),
                        contentType: isFormData ? false : 'application/x-www-form-urlencoded; charset=UTF-8',
                        processData: isFormData ? false : true,
                        beforeSend: function () {
                            if (pTarget) {
                                $(pTarget).trigger('ajaxLoadBefore');
                            }
                        },
                        success: function (d) {
                            if (dataType == 'json') {
                                if (typeof d === "string") {
                                    d = $.parsejson(d);
                                }
                            }
                            // error msg
                            if (d.status != "success" && d.message != null) {
                                ajax.popupErrorMsg(d.message);
                                d = false;
                            }

                            if (pTarget) {
                                $(pTarget).trigger('ajaxLoadEnd');
                            }
                            callback(d, this);
                        },
                        error: function (request, status, error) {
                            console.log("status: " + status);
                            console.log("error: " + error);
                            if (pTarget) {
                                $(pTarget).trigger('ajaxLoadEnd');
                            }
                            callback(false, this);
                            ajax.popupErrorMsg(error);
                        }
                    });
                },
                popupErrorMsg: function (msg) {
                    mageAlert({
                        title: $.mage.__('Error'),
                        content: msg
                    });
                }
            };
            $('body').on({
                'ajaxLoadBefore':function(e){
                    e.stopPropagation();
                    $(this).append('<div class="loading-circle"><div class="lds-dual-ring"></div></div>');
                },
                'ajaxLoadEnd':function(e){
                    e.stopPropagation();
                    $(this).find('.loading-circle').remove();
                }
            });
            $('.C0003 .component-inner-box, .C0004 .component-inner-box').on({
                'ajaxLoadBefore':function(e){
                    e.stopPropagation();
                    $(this).append('<div class="loading-circle"><div class="lds-dual-ring"></div></div>');
                },
                'ajaxLoadEnd':function(e){
                    e.stopPropagation();
                    $(this).find('.loading-circle').remove();
                }
            });

// Script used to change options of select by calling ajax
            (function ($) {
                $.fn.drawAjaxOptions = function (options) {
                    var _this = this.get(0);
                    var $this = $(this);
                    var opt = $.extend({
                        setTarget: null,
                        url: null,
                        dynamicParam: false,
                        param: {},
                        keyName: null,
                        keyValue: null,
                        empty: function () {
                        },
                        notEmpty: function () {
                        },
                        callback: function () {
                        }
                    }, options, $this.data());

                    var category = {
                        initialized: false,
                        init: function () {
                            if (!category.initialized) {
                                category.addEvent();
                                category.initialized = true;
                            }
                        },
                        creatOptions: function (t, dataObj) {
                            var html = '';
                            // selectbox placeholder
                            html += '<option value="" disabled selected>' + t.getAttribute('data-placeholder') + '</option>';

                            if (opt.dataArray) {
                                dataObj = dataObj.data instanceof Array ? dataObj.data[0] : dataObj;
                                //console.log(dataObj);
                                dataObj = dataObj[opt.dataArray];
                            }
                            if ((JSON.stringify(dataObj) == '{}' || dataObj.length == 0) || JSON.stringify(dataObj) == undefined) {
                                $(t).html('');
                                t.setAttribute('disabled', 'disabled');
                                $this.trigger('options.empty');
                            } else {
                                for (var key in dataObj) {
                                    var text, val;

                                    if (typeof dataObj[key] == "object") {
                                        if(opt.keyName != null && opt.keyValue != null) {
                                            // has option key names
                                            var currentKey = dataObj[key];
                                            text = currentKey[opt.keyName];
                                            val = currentKey[opt.keyValue];
                                        }else {
                                            // default
                                            for (var k in dataObj[key]) {
                                                text = dataObj[key][k];
                                                val = k;
                                            }
                                        }

                                    } else {
                                        text = dataObj[key],
                                            val = key; // jshint ignore:line
                                    }

                                    if (val == null || val == '') {
                                        html += '<option value="' + val + '" disabled>' + text + '</option>';
                                    } else {
                                        html += '<option value="' + val + '">' + text + '</option>';
                                    }
                                }
                                $(t).html(html);
                                $this.trigger('options.notEmpty');
                                t.removeAttribute('disabled');
                            }
                            $(t).trigger('chosen:updated');
                        },
                        changeEventFnc: function (e, f) {
                            if(f == true) return false;
                            var check = jQuery().checkValidation != undefined && $(e.currentTarget).checkValidation({onlyBoolean: true});
                            if (e.currentTarget.type.indexOf("select") >= 0 || check) {
                                var _param = opt.param;
                                if (opt.dynamicParam == true) {
                                    _param = e.currentTarget.getAttribute('data-param');
                                    _param = _param ? _param : {};
                                }

                                if (typeof _param != 'string') {
                                    _param = $.param(_param);
                                }

                                var optionParam = $(e.currentTarget).find("option").eq(e.currentTarget.selectedIndex).data();
                                optionParam = optionParam ? jQuery.param(optionParam) : "";

                                var param = $(e.currentTarget).serialize() + "&" + _param + "&" + optionParam;
                                var url = opt.url;
                                // var data = ajax.call(url, param);
                                ajax.noCacheCall(url, param, 'json', function (data) {
                                    if (data) {
                                        category.creatOptions(opt.setTarget, data);
                                        opt.callback(data);
                                    }
                                });
                                $(opt.setTarget).trigger('chosen:updated');
                            }
                        },
                        addEvent: function () {
                            if (_this.type.indexOf("select") >= 0) {
                                $this.on({
                                    'change.base': category.changeEventFnc
                                });
                            } else {
                                $this.on({
                                    'blur.base': category.changeEventFnc
                                });
                            }
                            $this.on({
                                'options.empty': opt.empty,
                                'options.notEmpty': opt.notEmpty
                            });
                        }
                    };

                    return this.each(function () {
                        category.init();
                    });
                };
            })(jQuery);

// form
            window.setForm = function () {
                var target = document.getElementsByTagName('form');
                for (var i = 0; i < target.length; i++) {
                    var _this = target[i];
                    var method = _this.getAttribute('data-ajax-method');
                    method = method ? method : commonSendType;
                    _this.removeAttribute('data-ajax-method');

                    $(_this).data('ajaxMethod', method);
                }
            };

// init
            $(document).ready(function () {
                initSVG();
                winowPop();
                tooltipActive();
                setForm();
            });

// search box common script
            window.searchCommon = [];
            window.searchInit = function () {
                $('.search-common').each(function (idx) {
                    var $searchCommon = $(this);
                    this.setAttribute('data-search-idx', idx);
                    searchCommon[idx] = {
                        //$obj : $(document.querySelector('.search-common')),
                        $obj: $searchCommon,
                        canFocus: 0,
                        canSubmit: 0,
                        canCookie: 0,
                        minLength: 0,
                        cookieName: '',
                        action: '',
                        max: 10,
                        functionName: '',
                        $layer: null,
                        $input: null,
                        $recentArea: null,
                        $resultArea: null,
                        $template: null,
                        $btnSubmit: '',
                        $btnClose: '',
                        init: function () {
                            var el = this.$obj;
                            this.canFocus = el.data('canfocus');
                            this.canSubmit = el.data('cansubmit');
                            this.cookieName = el.data('cookiename');
                            this.functionName = el.data('function');
                            this.minLength = el.data('minlength') ? el.data('minlength') : 1;
                            this.$layer = el.find('.search-layer');
                            this.$input = el.find('.search-common-input');
                            this.$recentArea = this.$layer.find('.recent-suggested-type');
                            this.$resultArea = this.$layer.find('.search-result-list');
                            this.$template = this.$layer.find('template');
                            this.action = el.attr('action');
                            this.max = el.data('max');
                            this.$btnSubmit = el.find('input.submit');
                            this.$btnClose = el.find('.link-close');
                            if (this.cookieName) {
                                this.canCookie = 1;
                            }
                            // Recent, Focus and Input must be run when layer exists
                            if (this.$layer.length > 0) {
                                this.bindInput();
                                if (this.canFocus > 0) {
                                    this.bindFocus();
                                } else {
                                    // hide see more
                                    this.$resultArea.find('.search-result-seemore').hide();
                                    this.bindNoFocus();
                                }
                                // If layer exists in mobile, float to top in focus
                                /*
                                if ('ontouchstart' in window) {
                                    this.$input.on('focus', function() {
                                        //searchCommon[idx].$obj.addClass('fixed');
                                        $('body').addClass('floating-search');
                                    });
                                    // close
                                    this.$input.on('blur', function() {
                                        searchCommon[idx].$obj.removeClass('fixed');
                                        $('body').removeClass('band-scroll');
                                    });
                                }
                                */
                                // Find all focusable children

                                var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

                                this.$layer.on({
                                    keydown: function(e){
                                        // Convert NodeList to Array
                                        var focusableElements = e.currentTarget.querySelectorAll(focusableElementsString);
                                        focusableElements = Array.prototype.slice.call(focusableElements);
                                        var firstTabStop = focusableElements[0];
                                        var lastTabStop = focusableElements[focusableElements.length - 1];
                                        // Check for TAB key press
                                        if (e.keyCode === 9) {
                                            // SHIFT + TAB
                                            if (e.shiftKey) {
                                                if (document.activeElement === firstTabStop) {
                                                    e.preventDefault();
                                                    lastTabStop.focus();
                                                }
                                                // TAB
                                            } else {
                                                if (document.activeElement === lastTabStop) {
                                                    e.preventDefault();
                                                    firstTabStop.focus();
                                                }
                                            }
                                        }
                                        // ESCAPE
                                        if (e.keyCode === 27) {
                                            closeModal();
                                        }
                                    }
                                }, '.predictive-search');
                            }
                            this.$btnClose.on('click', function (e) {
                                e.preventDefault();
                                searchCommon[idx].$layer.removeClass('active');
                            });

                            // Submit
                            this.bindSubmit();

                            // Close search layer
                            $('body').on('click touchend', function (event) {
                                if (!$(event.target).parents('.search-area')[0]) {
                                    searchCommon[idx].$layer.removeClass('active');
                                }
                            });
                            // Close the search layer when blur event occurs at the end of the search layer
                            this.$recentArea.find('ul.list:last-child li:last-child a').on('blur', function () {
                                searchCommon[idx].$layer.removeClass('active');
                            });
                            this.$resultArea.find('.search-result-seemore a').on('blur', function () {
                                searchCommon[idx].$layer.removeClass('active');
                            });
                            this.$input.data('oldtext', ''); // for ie11 bug
                        },
                        bindNoFocus: function () {
                            if($('.search-model-result').length>0) {
                                // manuals and documents, software and drivers page only
                                this.$input.on('focus', function (e) {
                                    e.preventDefault();
                                    if (!searchCommon[idx].$layer.hasClass('active')) {
                                        searchCommon[idx].$layer.addClass('active');
                                    }
                                });
                            }
                        },
                        bindFocus: function () {
                            this.$input.on('focus', function (e) {
                                e.preventDefault();
                                // check the cookie
                                var recentCookieTxt;
                                var recentCookieArr;
                                if (this.canCookie == 1) {
                                    recentCookieTxt = getCookie(searchCommon[idx].cookieName);
                                    if (recentCookieTxt == undefined) recentCookieTxt = '';
                                    recentCookieArr = recentCookieTxt.split('|');
                                    if (recentCookieTxt == '') {
                                        removeCookie(searchCommon[idx].cookieName);
                                    }
                                }
                                // open the layer
                                if (!searchCommon[idx].$layer.hasClass('active')) {
                                    searchCommon[idx].$layer.addClass('active');
                                }
                                searchCommon[idx].doRecent();
                            });
                        },
                        bindInput: function () {
                            this.$input.on('input', function (e) {
                                // check the cookie
                                var recentCookieTxt;
                                var recentCookieArr;
                                if (this.canCookie == 1) {
                                    recentCookieTxt = getCookie(searchCommon[idx].cookieName);
                                    recentCookieArr = recentCookieTxt.split('|');
                                    if (recentCookieTxt == '') {
                                        removeCookie(searchCommon[idx].cookieName);
                                    }
                                }
                                // check the input's value
                                if (searchCommon[idx].$input.val() == '' && (searchCommon[idx].$input.data('oldtext') != searchCommon[idx].$input.val())) {
                                    searchCommon[idx].doRecent();
                                    // open the layer
                                    if (!searchCommon[idx].$layer.hasClass('active')) {
                                        searchCommon[idx].$layer.addClass('active');
                                    }
                                } else if (searchCommon[idx].minLength <= searchCommon[idx].$input.val().length) {
                                    searchCommon[idx].doResult();
                                    // open the layer
                                    if (!searchCommon[idx].$layer.hasClass('active')) {
                                        searchCommon[idx].$layer.addClass('active');
                                    }
                                }
                                searchCommon[idx].$input.data('oldtext', searchCommon[idx].$input.val());
                            });
                        },
                        bindSubmit: function () {
                            this.$btnSubmit.on('click', function (e) {
                                e.preventDefault();
                                if ($(this).closest('.parts-accessories').length > 0) {
                                    // for parts & accessories
                                    window.adobeTrackEvent('parts-accessories-search', {
                                        search_keyword: $(this).siblings('.search-common-input').val(),
                                        search_type: "support:parts_accessories",
                                        page_event: {onsite_search: true}
                                    });
                                }
                                searchCommon[idx].doSubmit();
                            });
                        },
                        bindClickKeyword: function () {
                            searchCommon[idx].$recentArea.find('ul.list li a').not('.delete').off('click', '**').on('click', function (e) {
                                e.preventDefault();
                                // Adding a value to the search input and Submit Form
                                var searchTxt = xssfilter($(this).find('.product-name').text(), 'form');
                                searchCommon[idx].$input.val(searchTxt);
                                searchCommon[idx].doSubmit();
                            });
                        },
                        bindDeleteKeyword: function () {
                            searchCommon[idx].$recentArea.find('ul.list li a.delete').off('click', '**').on('click', function (e) {
                                e.preventDefault();
                                var searchTxt = xssfilter($(this).parent().find('.product-name').text(), 'form'),
                                    recentNoResult = searchCommon[idx].$recentArea.find('.not-result'),
                                    recentList = searchCommon[idx].$recentArea.find('ul.list.recent-keyword');
                                //console.log('test1');
                                if (searchCommon[idx].canCookie == 1) {
                                    //console.log('test2');
                                    searchCommon[idx].deleteCookieList(searchTxt);
                                }
                                // Remove this in the list
                                $(this).closest('li').remove();
                                if (searchCommon[idx].$recentArea.find('ul.list.recent-keyword li').length <= 0) {
                                    recentNoResult.show();
                                    recentList.empty().hide();
                                }
                            });
                        },
                        doSubmit: function (noRefresh) {
                            var searchTxt = xssfilter(this.$input.val(), 'form');
                            this.$input.val(searchTxt);
                            if (!this.$obj.is('.auto-validation-form')) {
                                if ($.trim(searchTxt) != '') {
                                    if (this.canCookie == 1) this.addCookieList(searchTxt);
                                    var noSubmitArea = this.$resultArea.find('.no-submit');
                                    if (this.canSubmit == 1 && noRefresh != true) {
                                        if($('.resource-search-form-wrap').length>0 && $('.results-summary').length>0) {
                                            // CS Help Library, CS Video Tutorials
                                            window.adobeTrackEvent('cs-onsite-search', {search_keyword : searchCommon[idx].$obj.find('.search-input input[type=text]').val(), page_event : {onsite_search : true}});
                                        }
                                        this.$obj.submit();
                                    } else {
                                        noSubmitArea.show();
                                        if($('.search-model-result').length>0) {
                                            // manuals and documents, software and drivers page only
                                            if (this.canFocus <= 0) {
                                                if (!searchCommon[idx].$layer.hasClass('active')) {
                                                    searchCommon[idx].$layer.addClass('active');
                                                }
                                            }
                                        }
                                        return false;
                                    }
                                } else {
                                    return false;
                                }
                            } else {
                                this.$obj.submit();
                            }
                        },
                        doResult: function () {
                            this.$resultArea.show();
                            this.$recentArea.hide();
                            var noSubmitArea = this.$resultArea.find('.no-submit'),
                                url = this.$input.data('predictive-url'),
                                searchTxt = {};

                            if(this.$resultArea.closest('.C0009').length>0) {
                                searchTxt.searchModel = xssfilter(this.$input.val(), 'form');
                                searchTxt.modelId=this.$obj.find('input[name=modelId]').val();
                            } else {
                                searchTxt.search = xssfilter(this.$input.val(), 'form');
                            }

                            noSubmitArea.hide();
                            // ajax call
                            ajax.call(url, searchTxt, 'json', function (data, _this) {
                                if(data.data) {
                                    searchCommon[idx].ajaxSuccess(data.data[0], _this);
                                } else {
                                    searchCommon[idx].ajaxSuccess(data, _this);
                                }
                            });
                        },
                        doRecent: function () {
                            if (this.canFocus == 1) this.$recentArea.show();
                            this.$resultArea.hide();
                            // check the cookie
                            var recentCookieTxt;
                            var recentCookieArr;
                            if (this.canCookie == 1) {
                                recentCookieTxt = getCookie(this.cookieName);
                                if (recentCookieTxt == undefined) recentCookieTxt = '';
                                recentCookieArr = recentCookieTxt.split('|');
                                if (recentCookieTxt == '') {
                                    removeCookie(this.cookieName);
                                }
                                var recentNoResult = searchCommon[idx].$recentArea.find('.not-result'),
                                    recentList = searchCommon[idx].$recentArea.find('ul.list.recent-keyword');
                                //console.log(recentCookieArr);
                                if (recentCookieTxt == 'undefined' || recentCookieTxt == '') {
                                    recentNoResult.show();
                                    recentList.empty().hide();
                                } else {
                                    if (recentCookieTxt == '') {
                                        recentNoResult.show();
                                        recentList.empty().hide();
                                    } else {
                                        var list = '';
                                        for (var i = 0; i < recentCookieArr.length; i++) {
                                            list = list + '<li><a href="#"><strong class="product-name">' + recentCookieArr[i] + '</strong></a><a href="#" class="delete"><span class="icon"></span><span class="sr-only">Delete</span></a></li>';
                                        }
                                        recentNoResult.hide();
                                        recentList.html(list).show();
                                        this.bindDeleteKeyword();
                                    }
                                }
                                this.bindClickKeyword();
                                // show recent head
                                this.$recentArea.find('.search-head').eq(0).show();
                            } else {
                                searchCommon[idx].$recentArea.find('.not-result').hide();
                                searchCommon[idx].$recentArea.find('ul.list.recent-keyword').empty().hide();
                                // hide recent head
                                this.$recentArea.find('.search-head').eq(0).hide();
                            }
                        },
                        addCookieList: function (searchTxt) {
                            // add searchTxt in cookie list
                            var recentCookieTxt = getCookie(this.cookieName);
                            if (recentCookieTxt == undefined) recentCookieTxt = '';
                            var recentCookieArr = recentCookieTxt.split('|');

                            // Clear duplicate values on array
                            var isDup = recentCookieArr.indexOf(searchTxt);
                            if (isDup > -1) recentCookieArr.splice(isDup, 1);

                            // If you have five search terms, delete the oldest one.
                            if(recentCookieArr.length>=5) {
                                recentCookieArr.pop();
                            }

                            // Add new value to the front of the array
                            if (recentCookieTxt == 'undefined' || recentCookieTxt == '') recentCookieArr = [searchTxt];
                            else recentCookieArr.unshift(searchTxt);

                            // set Cookie
                            setCookie(this.cookieName, recentCookieArr.join('|'));
                        },
                        deleteCookieList: function (searchTxt) {
                            // delete searchTxt in cookie list
                            var recentCookieTxt = getCookie(this.cookieName);
                            if (recentCookieTxt == undefined) recentCookieTxt = '';
                            var recentCookieArr = recentCookieTxt.split('|');
                            // delete searchTxt from array
                            var isTxt = recentCookieArr.indexOf(searchTxt);
                            if (isTxt > -1) recentCookieArr.splice(isTxt, 1);

                            // set Cookie
                            if (recentCookieArr.length > 0) {
                                setCookie(this.cookieName, recentCookieArr.join('|'));
                            } else {
                                removeCookie(this.cookieName);
                            }
                        },
                        ajaxSuccess: function (data, _this) {
                            var seemore = searchCommon[idx].$resultArea.find('.search-result-seemore');
                            if (!data.link || data.link == '') {
                                seemore.hide();
                            } else {
                                seemore.show().find('a').attr('href', data.link);
                            }

                            var recentNoResult = searchCommon[idx].$resultArea.find('.not-result'),
                                resultList = searchCommon[idx].$resultArea.find('ul.list');

                            if (data.Flag == 'N') {
                                recentNoResult.show();
                                resultList.hide();
                            } else {
                                recentNoResult.hide();
                                resultList.show();
                                var len = data.predictive ? data.predictive.length : '';
                                html = '';
                                if (len > 0) {
                                    if (len > this.max) len = this.max;

                                    if (this.$template[0] != undefined) {
                                        var template = this.$template;
                                        this.$template.find('script').remove();
                                        for (var j = 0; j < len; j++) {
                                            var _templateMarkup = template.clone().html();

                                            _templateMarkup = _templateMarkup.replace('*url*', data.predictive[j].url)
                                                .replace('*model*', data.predictive[j].model)
                                                .replace('*name*', data.predictive[j].name)
                                                .replace('*category*', data.predictive[j].category);

                                            html = html + (_templateMarkup);
                                        }

                                    } else {
                                        for (var i = 0; i < len; i++) {

                                            var tempCateHTML = '';
                                            if(data.predictive[i].cate) tempCateHTML = tempCateHTML + ' data-category='+data.predictive[i].cate;
                                            else if(data.predictive[i].cs_category_id) tempCateHTML = tempCateHTML + ' data-category='+data.predictive[i].cs_category_id;
                                            if(data.predictive[i].subcate) tempCateHTML = tempCateHTML + ' data-subcategory='+data.predictive[i].subcate;
                                            else if(data.predictive[i].cs_sub_category_id) tempCateHTML = tempCateHTML + ' data-subcategory='+data.predictive[i].cs_sub_category_id;

                                            if (data.predictive[i].model) { // model search
                                                html = html + '<li><a rel="nofollow" href="' + data.predictive[i].url + '"'+tempCateHTML+'><span class="model-name">' + data.predictive[i].model + '</span><span class="product-name">' + data.predictive[i].name + '</span><span class="category-name">' + data.predictive[i].category + '</span></a></li>';
                                            }
                                            else {
                                                html = html + '<li><a rel="nofollow" href="' + data.predictive[i].url + '"'+tempCateHTML+'><span class="model-name">' + data.predictive[i].content + '</span><span class="product-name">' + data.predictive[i].name + '</span><span class="category-name">' + data.predictive[i].category + '</span></a></li>';
                                            }
                                        }
                                    }
                                    resultList.html(html);
                                    if (this.functionName && this.functionName != '') {
                                        resultList.find('li a').on('click', function (e) {
                                            e.preventDefault();
                                            var model = $(this).find('.model-name').text();
                                            var category = $(this).data('category');
                                            var subcategory = $(this).data('subcategory');
                                            var functionNameText = searchCommon[idx].functionName;
                                            if(functionNameText) {
                                                if(functionNameText=="pickerBox.model") {
                                                    // CS Software & Drivers, CS Manuals & Documents
                                                    new Function(functionNameText + '("' + model + '", "'+category+'", "'+subcategory+'")')(); // jshint ignore:line
                                                    $(this).closest('form.search-common').find('.search-input input[type=text]').val($(this).find('.model-name').text());
                                                    // CS Software & Drivers, CS Manuals & Documents : Search
                                                    window.adobeTrackEvent('cs-onsite-search', {search_keyword : searchCommon[idx].$obj.find('.search-input input[type=text]').val(), page_event : {onsite_search : true}});
                                                } else {
                                                    new Function(functionNameText + '()')(); // jshint ignore:line
                                                }
                                            }
                                            searchCommon[idx].$layer.removeClass('active');
                                        });
                                    }
                                    var $resultValue = searchCommon[idx].$layer.find('.results .value');
                                    if ($resultValue.length > 0) {
                                        $resultValue.text(data.predictive.length);
                                    }
                                } else {
                                    recentNoResult.show();
                                    resultList.hide();
                                    var $resultValue1 = searchCommon[idx].$layer.find('.results .value');
                                    if ($resultValue1.length > 0) {
                                        $resultValue1.text('0');
                                    }
                                }
                            }
                        }
                    };
                    searchCommon[idx].init();
                });
            };
            (function ($) {
                if (!document.querySelector('.search-common')) return false;
                window.searchInit();
            })(jQuery);

// jquery datepicker
            (function ($) {
                var runDatepicker = function () {
                    var dps = document.querySelectorAll('.datepicker-wrap');

                    $(dps).each(function () {
                        var el = this; // this
                        var $calander = $(el).find('.run-datepicker'); // this
                        var dayNames = $calander.get(0).getAttribute('data-day-names');
                        if (dayNames) {
                            var split = dayNames.match(/,|\/|-|\|/);
                            dayNames = dayNames.match(/,|\/|-|\|/) ? dayNames.split(split) : null;
                        }
                        $calander.datepicker({
                            dayNamesMin: dayNames ? dayNames : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // default = 영문
                            showOtherMonths: true,
                            dateFormat: $calander.get(0).getAttribute('data-date-format'),
                            beforeShow: function () {
                                if (!('ontouchstart' in window)) {
                                    $(window).on({
                                        resize: function () {
                                            $('.run-datepicker').datepicker('hide').blur();
                                            $(window).off('resize');
                                        }
                                    });
                                }
                            }
                        });
                        // .datepicker("setDate", new Date())
                        $(el).find('.datepicker-trigger').on({
                            click: function (e) {
                                e.preventDefault();
                                $calander.datepicker('show');
                            }
                        });
                    });
                };
                runDatepicker();
            })(jQuery);

// tab Scripts
            (function ($) {
                if (!document.querySelector('.tabs-type-liner') && !document.querySelector('.tabs-type-rect')) return false;

                var $tabs = $('.tabs-type-liner, .tabs-type-rect');
                $tabs.each(function () {
                    $(this).find('a').on('click', function (e) {
                        // click tabs
                        e.preventDefault();
                        if ($(this).attr('href').indexOf('/') != -1) {
                            location.href = $(this).attr('href');
                        } else {
                            var target = '#' + $(this).attr('href').split('#')[1];
                            var $parent = $(this).closest('.tabs-type-liner, .tabs-type-rect');
                            // change tab design
                            $parent.find('a').not($(this)).removeClass('active');
                            $(this).addClass('active');
                            // toggle selected tab area
                            if (target != "#" && $(target).get(0)) {
                                var tclass = $(target).attr('class').replace(' active', '').split(' ')[0];
                                //console.log(tclass);
                                var target2 = ($parent.parent().find('.' + tclass).length > 0) ? $parent.parent().find('.' + tclass) : $parent.parent().parent().find('.' + tclass);
                                if (target2.length == 0 && $parent.closest('.tab-wrap').length > 0) {
                                    var $parent2 = $parent.closest('.tab-wrap');
                                    target2 = ($parent2.parent().find('.' + tclass).length > 0) ? $parent2.parent().find('.' + tclass) : $parent2.parent().parent().find('.' + tclass);
                                }
                                //console.log(target2);
                                var parentType = 1;
                                if ($parent.closest('.track-repair-signin').length > 0) {
                                    // track repair signin
                                    target2 = $parent.closest('.track-repair-signin').find('.' + tclass);
                                    parentType = 2;
                                } else if ($parent.closest('.component').length > 0) {
                                    // components (all)
                                    parentType = 3;
                                    target2 = $parent.closest('.component').find('.' + tclass);
                                    if ($(target).find('.slick-slider').length > 0) {
                                        setTimeout(function () {
                                            $(target).css({"opacity": 0});
                                            target2.removeClass('active');
                                            $(target).addClass('active');
                                            setTimeout(function () {
                                                $(target).find('.slick-slider').css({'width': '100%'}).slick('setPosition');
                                                $(target).animate({'opacity': 1}, 200);
                                            }, 200);
                                        }, 200);
                                    } else {
                                        target2.removeClass('active');
                                        $(target).addClass('active');
                                    }
                                }
                                if (parentType < 3) {
                                    target2.removeClass('active');
                                    $(target).addClass('active');
                                }
                            }
                        }
                    });
                });
            })(jQuery);

// Scripts that run on designed input=file
            var bindFileUpload;
            (function ($) {
                bindFileUpload = function () {
                    var $file = $('.delivery-part').not('.available');
                    if ($file.length >= 1) {
                        $file.each(function () {
                            var _this = this;
                            $(this).addClass('available');
                            var $inputTxt = $(this).find('.file-name-expose'),
                                $inputFile = $(this).find('.replace-file-input input[type=file]');

                            // Print file name when file is attached
                            $(_this).on({
                                change: function (e) {
                                    var fileName;
                                    var delTarget = e.delegateTarget;
                                    var _$inputTxt = $(delTarget).find('input.file-name-expose');
                                    if(e.currentTarget.files[0]) {
                                        var deleteText = _$inputTxt.attr('data-delete-title') ? _$inputTxt.attr('data-delete-title') : 'Delete';
                                        if (window.FileReader) {
                                            fileName = $(e.currentTarget)[0].files[0].name;
                                        } else {
                                            fileName = $(e.currentTarget).val().split('/').pop().split('\\').pop();
                                        }
                                        _$inputTxt.focus().val(fileName);

                                        $(delTarget).addClass('attached');

                                        if (!$(delTarget).find('div.file-name-expose').get(0)) {
                                            _$inputTxt.wrap('<div class="file-name-expose"></div>');
                                            $(delTarget).find('div.file-name-expose').append('<a class="delete" href="#"><span class="icon"></span><span class="sr-only">' + xssfilter(deleteText) + '</span></a>');
                                        }
                                    }else {
                                        fileName = $(e.currentTarget).val().split('/').pop().split('\\').pop();
                                        $(e.currentTarget).closest('.field-block').removeClass('error');
                                        _$inputTxt.focus().val('');
                                    }
                                }
                            }, 'input[type=file]');

                            $(_this).on({
                                click: function (e) {
                                    e.preventDefault();
                                    var delTarget = e.delegateTarget;
                                    $(delTarget).removeClass('attached');
                                    $(delTarget).find('input').val('');

                                    // Remove error class when file is deleted
                                    $(delTarget).closest('.error').removeClass('error');
                                }
                            }, '.delete');

                            // Pre-treat capacity limits to prevent arbitrary changes
                            if ($inputFile.data('max')) {
                                var max = $inputFile.data('max');
                                $inputFile.removeAttr('data-max');
                                $inputFile.data('max', max);
                            }

                            // Pre-process file extension limit values to prevent arbitrary changes
                            if ($inputFile.data('extension')) {
                                var extension = $inputFile.data('extension');
                                $inputFile.removeAttr('data-extension');
                                $inputFile.data('extension', extension);
                            }
                        });
                    }
                };
                bindFileUpload();
            })(jQuery);

// modal
            $(function () {
                // fix modal for ie9
                var isIE = window.ActiveXObject || "ActiveXObject" in window;
                if (isIE) {
                    $('.modal').removeClass('fade');
                }
            });

// print
            var runPrint;
            (function ($) {
                runPrint = function () {
                    if (!document.querySelector('.page-print') && !document.querySelector('.page-print')) return false;
                    var $printPage = $('.page-print');
                    $printPage.off().on('click', function (e) {
                        e.preventDefault();

                        if($('.request-repair-completion').length>0) {
                            // request repair
                            window.adobeTrackEvent('cs-repair-print', {page_event : {print_repair_request : true}});
                        } else if($('.dispatch-portal-completion').length>0) {
                            // dispatch portal
                            window.adobeTrackEvent('cs-repair-print', {page_event : {print_repair_request : true}});
                        } else if($('.request-ra-completion').length>0) {
                            // request ra
                            window.adobeTrackEvent('cs-repair-print', {page_event : {print_repair_request : true}});
                        } else if($('.request-swap-completion').length>0) {
                            // request swap
                            window.adobeTrackEvent('cs-repair-print', {page_event : {print_repair_request : true}});
                        } else if ($('.repair-info-wrap').length>0) {
                            // track repair detail
                            window.adobeTrackEvent('cs-repair-print', {page_event : {print_repair_request : true}});
                        } else if ($('.email-result').length>0) {
                            // email result
                            window.adobeTrackEvent('cs-repair-print', {page_event : {print_repair_request : true}});
                        }

                        var modal = $(e.currentTarget).parents('.modal').get(0);
                        if (modal) {
                            //console.log('1');
                            var divToPrint = modal;
                            var newWin = window.open('', 'Print-Window');
                            newWin.document.open();
                            newWin.document.write('<html><body onload="window.print()"><link rel="stylesheet" href="/lg5-common/css/modal-print.min.css" type="text/css" /><div class="modal">' + divToPrint.innerHTML + '</div></body></html>');
                            setTimeout(function() {
                                newWin.document.close();
                                setTimeout(function () {
                                    newWin.close();
                                }, 10);
                            }, 200);
                        } else {
                            window.print();
                        }
                    });
                };
                runPrint();
            })(jQuery);

// scroll tab
            var tabGuideActive, tabMktControll;
            (function ($) {
                tabGuideActive = function () {
                    var $guide = $('.js-tab-guide-outer');
                    for (var i = 0; i < $guide.length; i++) {
                        var $this = $guide.eq(i);
                        var arrow = '<div class="arrow"></div>';
                        if ($this.outerWidth() < $this.find('.js-tab-guide-inner').outerWidth()) {
                            $this.append(arrow);
                        }
                    }
                    $guide.off().on({
                        touchend: function () {
                            $(this).find('.arrow').addClass('js-fade');
                        }
                    });
                };
                if ('ontouchstart' in window && mql.maxXs.matches) {
                    $(window).on({
                        'orientationchange.tab': function () {
                            tabGuideActive();
                        }
                    });
                    tabGuideActive();
                }

                tabMktControll = function () {
                    var $mktTab = $('.js-tab-controll');
                    $mktTab.on({
                        click: function (e) {
                            var current = e.currentTarget,
                                scroll = e.delegateTarget.querySelector('.js-tab-guide-outer');
                            // .mCustomScrollbar('scrollTo','+=300');
                            // this.mcs.topPct
                            if ($(current).is('.scroll-left')) {
                                $(scroll).mCustomScrollbar('scrollTo', '+=300');
                            } else if ($(current).is('.scroll-right')) {
                                $(scroll).mCustomScrollbar('scrollTo', '-=300');
                            }
                        }
                    }, 'button');

                    $mktTab.find('.js-tab-guide-outer').on({
                        scrolled: function () {
                            var $wrap = $(this).closest('.js-tab-controll');
                            $wrap.find('.scroll-left').removeAttr('disabled');
                            $wrap.find('.scroll-right').removeAttr('disabled');
                        },
                        totalScroll: function () {
                            var $wrap = $(this).closest('.js-tab-controll');
                            $wrap.find('.scroll-left').removeAttr('disabled');
                            $wrap.find('.scroll-right').attr('disabled', 'disabled');
                        },
                        totalScrollBack: function () {
                            var $wrap = $(this).closest('.js-tab-controll');
                            $wrap.find('.scroll-left').attr('disabled', 'disabled');
                            $wrap.find('.scroll-right').removeAttr('disabled');
                        }
                    });

                    $mktTab.find('.js-tab-guide-outer').trigger('totalScrollBack');
                };
                if (!('ontouchstart' in window && mql.maxXs.matches)) {
                    tabMktControll();
                }
                // //js-tab-controll
            })(jQuery);

// ie browser form attribute polyfill
            (function () {
                // Via Modernizr
                function formAttributeSupport() {
                    var form = document.createElement("form"),
                        input = document.createElement("input"),
                        div = document.createElement("div"),
                        id = "formtest" + (new Date().getTime()),
                        attr,
                        bool = false;

                    form.id = id;
                    // IE6/7 confuses the form idl attribute and the form content attribute
                    if (document.createAttribute) {
                        attr = document.createAttribute("form");
                        attr.nodeValue = id;
                        input.setAttributeNode(attr);
                        div.appendChild(form);
                        div.appendChild(input);

                        document.documentElement.appendChild(div);

                        bool = form.elements.length === 1 && input.form == form;

                        div.parentNode.removeChild(div);
                    }

                    return bool;
                }

                if (!formAttributeSupport()) {
                    $(document)
                        .on("click", "[type=submit][form]", function (event) {
                            event.preventDefault();
                            var formId = $(this).attr("form"),
                                $form = $("#" + formId).submit();
                        })
                        .on("keypress", "form input", function (event) {
                            var $form;
                            if (event.keyCode == 13) {
                                $form = $(this).parents("form");
                                if ($form.find("[type=submit]").length == 0 &&
                                    $("[type=submit][form=" + $(this).attr("form") + "]").length > 0) {
                                    $form.submit();
                                }
                            }
                        });
                }
            }());

            // footer LG obs update class for styles from frontend
            (function ($) {
                // go to Select Your Region page
                $('.footer-box form.country-information>a').on('click', function(e) {
                    e.preventDefault();
                    $(this).closest('form').submit();
                });

                // toggle footer menu
                var appFooter = function () {
                    var footerObj = $('.footer-main-contents');
                    var footerTarget = footerObj.find('.visible-mobile');
                    var footerDepth1 = footerTarget.find('.has-category');
                    footerDepth1.on('click', function (e) {
                        if ($(this).hasClass('on')) {
                            return true;
                        } else {
                            $(this).addClass('on');
                            $(this).next().slideDown(200);
                            $(this).append('<a href="#" class="button-layer"></a>');
                            layerButton();
                            return false;
                        }
                    });
                    footerObj.find('.footer-bottom .bottom-links .links-right').each(function() {
                        if($(this).find('> a').length>0) {
                            $(this).closest('.footer-bottom').addClass('banner-count'+$(this).find('> a').length);
                        }

                    });
                };
                var layerButton = function () {
                    $('.button-layer').off("click").on('click', function () {
                        $(this).parent().removeClass('on');
                        $(this).parent().next().slideUp(200);
                        $(this).off("click").remove();
                        return false;
                    });
                };
                appFooter();

            })(jQuery);

            function loginCheck() {
                var $nav = $('.navigation');
                var loginFlag = false;
                if (typeof token !== 'undefined' && token.userId) {
                    loginFlag = true;
                }

                if (loginFlag) {
                    var firstname = token.firstName;
                    var lastname = token.lastName;
                    var group = token.group;

                    /**
                     * Masking the name
                     * @type {string}
                     */
                    var fullName = (firstname?firstname.trim():"") + (lastname ?lastname.trim() :"");
                    var mask = "";
                    for(var i=0; i < fullName.length; i++) {
                        if(fullName.length % 2 == 0) {
                            if(i < (fullName.length/2)) {
                                mask+= fullName[i];
                            } else {
                                mask+="*";
                            }
                        } else {
                            if(i <= (fullName.length/2)) {
                                mask+= fullName[i];
                            } else {
                                mask+="*";
                            }
                        }
                    }
                    // desktop
                    $nav.find('.for-desktop .right-btm .login').addClass('logged').find('.after-login .welcome .name').text(mask);
                    // mobile
                    $nav.find('.for-mobile .right .login').addClass('logged').find('.after-login .name').text(mask);
                    $nav.find('.for-mobile .menu .mylg ').next().find('.welcome .name').text(mask);
                    $nav.find('.for-mobile .menu .mylg .login').addClass('logged');
                    $nav.find('.for-desktop .right-btm .login.logged').find('>a').on('mouseover', function (e) {
                        e.preventDefault();
                        $nav.find('.for-desktop .right-btm .login').addClass('logged').find('>div.gnb-login').addClass('active');
                        $nav.find('.for-desktop .right-btm .login.logged').find('>div.gnb-login').on("mouseleave", function(e) {
                            $(this).removeClass('active');
                        });
                    });

                    $nav.find('.for-desktop .right-btm .login.logged').find('>a').on('click', function(e) {
                        e.preventDefault();
                        var el = $nav.find('.for-desktop .right-btm .login.logged').find('>div.gnb-login');
                        if(el.length && el.hasClass('active')) {
                            el.removeClass('active');
                        }
                    })

                    // bind click event
                    // $nav.find('.for-mobile .menu .mylg .login.logged').find('>a.after-login').on('click', function (e) {
                    //     e.preventDefault();
                    //     var targetID = $(this).attr('href').split('#')[1];
                    //     if (targetID && targetID.length > 0) {
                    //         var $target = $(this).closest('.navigation').find('#' + targetID);
                    //         $target.addClass('active');
                    //         $mobileDepth1.removeClass('active');
                    //         $mobileTopMenu.removeClass('active');
                    //         $mobileMyLG.removeClass('active');
                    //         scrollToTop($(this));
                    //     }
                    // });

                    $nav.find('.for-mobile .menu .mylg .login.logged,.for-mobile .nav-wrap .right .login.logged').find('>a.after-login').on('click',function (e) {
                        e.preventDefault();
                        $(this).parents(".right").length && $nav.find(".for-mobile .menu>a").trigger("click");
                        var t, a, o = $(this).attr("href").split("#")[1];
                        o && 0 < o.length && (t = $(this).closest(".navigation").find("#" + o),
                            e = (a = $nav.find(".for-mobile")).find(".depth1-m"),
                            o = a.find(".top-link"),
                            a = a.find(".mylg"),
                            t.addClass("active"),
                            e.removeClass("active"),
                            e.siblings(".language").removeClass("active"),
                            e.siblings(".country").removeClass("active"),
                            o.removeClass("active"),
                            a.removeClass("active"),
                            e.siblings(".box-obs").removeClass("active"),
                            $(this).parents(".right").length ? t.find(".back").hide() : t.find(".back").show(),
                            function(e) {
                                e = e.closest(".navigation").offset().top;
                                $("html, body").stop().animate({
                                    scrollTop: e
                                }, 300)
                            }($(this)))
                    });


                    // page url ? LoginFlag=Yf
                    var currentUrl = window.location.href;
                    if(currentUrl.indexOf('LoginFlag=Y') != -1) {
                        adobeSatellite('set_member_id', {'member_id' : data.context.user.id});
                        if(history.replaceState) {
                            history.replaceState({login:'login'}, '', currentUrl.replace('?LoginFlag=Y', '').replace('&LoginFlag=Y', ''));
                        }
                    }

                    //add class vip-icon for vip-account
                    if(group && group != 'B2C' && group != 'UPGRADE USER' && group != "" && group != null){
                        //desktop
                        $nav.find('.for-desktop .right-btm .login.logged').addClass('is-vip');
                        //mobile
                        $nav.find('.for-mobile .right .login.logged').addClass('is-vip');
                        $nav.find('.for-mobile .menu .mylg .login.logged').addClass('is-vip');
                    }
                } else {
                    $nav.find('.for-desktop .right-btm .login').find('>a').on('mouseover', function (e) {
                        e.preventDefault();
                        $nav.find('.for-desktop .right-btm .login').find('>div.gnb-login').addClass('active');
                        $nav.find('.for-desktop .right-btm .login').find('>div.gnb-login').on("mouseleave", function(e) {
                            $(this).removeClass('active');
                        });
                        let loginLink = $nav.find('.for-desktop .right-btm .login')
                            .find('>div.gnb-login .before-login a.before-login');

                        let ssoUrl = options.ssoLoginUrl;
                        if(ssoUrl) {
                            loginLink.attr('href', ssoUrl);
                        } else {
                            var str = window.location.href;
                            var n = str.replace("https://","")
                            var storeCode = n.split('/');
                            if(window.location.href.indexOf('wwwstg.lg.com') > -1) {
                                loginLink.attr('href','https://wwwstg.lg.com/'+storeCode[1]+'/my-lg/login?state=/'+storeCode[1]+'/shop/checkout/cart/index/');
                            } else if(window.location.href.indexOf('www.lg.com') > -1 || window.location.href.indexOf('https://lg.com')) {
                                loginLink.attr('href','https://www.lg.com/'+storeCode[1]+'/my-lg/login?state=/'+storeCode[1]+'/shop/checkout/cart/index/');
                            } else {
                                loginLink.attr('href','https://wdev50.lg.com/'+storeCode[1]+'/my-lg/login?state=/'+storeCode[1]+'/shop/checkout/cart/index/');
                            }
                        }
                    });
                }
                // for obs menu
                if (!loginFlag) {
                    //console.log($nav.find('.obs-menu'));
                    $nav.find('.obs-menu').remove();
                }
            }

// navigation
            (function () {
                if (!document.querySelector('.navigation')) return false;

                // navigation
                var $nav = $('.navigation');
                if ($nav.length > 0) {

                    // desktop view
                    // gnb
                    var $depthLink = $nav.find('.depth1 > li > a, .depth2 li > a');
                    var $scrollBtn = $nav.find('.depth1 .scroll .scroll-left a, .depth1 .scroll .scroll-right a');
                    var $icons = $nav.find('.right-btm .icons, .right .icons');
                    var $iconBtn = $icons.find('>div>a');
                    var $searchInput = $nav.find('.search .search-input input.input');
                    var $closeSubLayer = $('.sublayer .close a', $nav);
                    var $searchForms = $nav.find('.gnb-search-form');
                    var isMouseOver = false;

                    $searchForms.on('submit', function(e) {
                        var searchTxt = $(this).find('.search-input input[type=text]').val();
                        $(this).find('.search-input input[type=text]').val(xssfilter(searchTxt, 'form'));
                        if(searchTxt!=xssfilter(searchTxt)) {
                            $(this).submit();
                        }
                    });
                    // bind click event
                    $depthLink.on('touch click', function (e) {
                        if ('ontouchstart' in document.documentElement) {
                            e.preventDefault();
                            //console.log('test1');
                            $(this).trigger('focus');
                        } else {
                            //console.log('test2');
                            return true;
                        }
                    });
                    $depthLink.on('focus mouseenter', function (e) {
                        e.preventDefault();
                        if ($(this).is($scrollBtn)) return false;
                        var _this = $(this);

                        isMouseOver = true;
                        setTimeout(function() {
                            if(!isMouseOver) return false;

                            var $contain = _this.closest('ul'); // depth1 or depth2
                            var $tabletLayer = $contain.closest('.navigation').find('.left-btm .tablet-layer');
                            $contain.find('li a').not(_this).removeClass('active');
                            _this.addClass('active');

                            // close search lyaer
                            $nav.find('.search-result-layer').removeClass('active');

                            // control right area
                            $icons.find('.gnb-login').removeClass('active');

                            var $window = $(window).width();

                            if ($contain.hasClass('depth1')) {
                                // tablet-layer
                                $tabletLayer.removeClass('active').empty();

                                // controlArrow
                                controlScrollX(window.matchMedia('(min-width: 768px) and (max-width: 1325px)')); // 초기 실행
                                controlArrow();

                                // slick
                                var dt = 768;
                                if (dt < $window) {
                                    //var target = '#'+_this.attr('href').split('#')[1];
                                    var target = '#' + _this.data('id');
                                    if ($(target).find('.slick-slider').length > 0) {
                                        _this.parent().find('.feature-box').get(0).slick.setPosition();
                                    }
                                    if (_this.hasClass('active')) {
                                        if (_this.next().find('.slick-dot-wrap .slide-pause').hasClass('pause')) {
                                            return;
                                        } else {
                                            _this.next().find('.slick-dot-wrap .slide-pause').trigger('click');
                                        }
                                    }
                                }
                            }

                            function isEmpty(el) {
                                return !$.trim(el.html());
                            }

                            if ($contain.hasClass('depth2')) {
                                // menu
                                $contain.closest('.depth1').find('>li').not($contain.closest('li')).find('> a').removeClass('active');
                                $contain.closest('li').find('> a').addClass('active');
                                // tablet-layer
                                var $tabletnav = _this.parent().find('.sublayer');
                                if ($tabletnav.length > 0) {
                                    // append html
                                    var htmlTmp = $tabletnav.clone().wrapAll("<div/>").parent().html();
                                    htmlTmp = xssfilter(htmlTmp, true);
                                    $tabletLayer.html(htmlTmp);
                                    $tabletLayer.addClass('active');
                                    // close sublayer
                                    $tabletLayer.find('.sublayer .close a').off('click').on('click', function (e) {
                                        e.preventDefault();
                                        _this.closest('.tablet-layer').removeClass('active').empty();
                                        $contain.find('li > a.active').removeClass('active');
                                    });
                                }
                                // slick
                                if (!isEmpty(_this.parent().find('.sublayer .sublayer-inner .columns'))) {
                                    var dt2 = 768;
                                    if (dt2 < $window) {
                                        if (_this.parent().find('.feature-box').length > 0) {
                                            _this.parent().find('.feature-box').get(0).slick.setPosition();
                                        }
                                        $contain.parents('.depth2').find('.slick-initialized').slick('slickPause');
                                        $contain.parents('.depth2').find('.slick-dot-wrap .slide-pause').removeClass('pause').addClass('play').text(_this.attr('data-title-play'));
                                        if ($nav.find('.slick-dot-wrap .slide-pause').hasClass('pause')) {
                                            $nav.find('.slick-dot-wrap .slide-pause.pause').trigger('click');
                                        }
                                        if (_this.hasClass('active')) {
                                            if (_this.next().find('.slick-dot-wrap .slide-pause').hasClass('pause')) {
                                                //return;
                                            } else {
                                                _this.next().find('.slick-dot-wrap .slide-pause').trigger('click');
                                            }
                                        }
                                    }
                                }
                            }
                        }, 300);
                    });
                    // 2depth x-scroll
                    $scrollBtn.on('click', function (e) {
                        e.preventDefault();
                        if ($(this).parent().hasClass('scroll-left')) {
                            $(this).closest('.scroll').find('.depth2').mCustomScrollbar('scrollTo', '+=300');
                        } else {
                            $(this).closest('.scroll').find('.depth2').mCustomScrollbar('scrollTo', '-=300');
                        }
                    });
                    // 2depth x-scroll arrow
                    var controlArrow = function () {
                        setTimeout(function () {
                            $nav.find('.mCSB_container').each(function () {
                                if ($(this).hasClass('mCS_no_scrollbar_x')) {
                                    $(this).closest('.scroll').find('.scroll-left, .scroll-right').hide();
                                } else {
                                    $(this).closest('.scroll').find('.scroll-left, .scroll-right').show();
                                }
                            });
                        }, 300);
                    };
                    $(window).resize(function () {
                        controlArrow();
                    });
                    var controlScrollX = function (e) {
                        var scrollX = $nav.find('.depth1 .scroll .depth2');
                        if (e.matches) {
                            scrollX.each(function () {
                                if (!$(this).hasClass('mCustomScrollbar') && $(this).closest('.depth1-holder').find('>a').hasClass('active')) {
                                    //console.log('start');
                                    $(this).mCustomScrollbar({theme: 'dark', mouseWheelPixels: 300, axis: 'x'});
                                }
                            });
                        } else {
                            scrollX.each(function () {
                                if ($(this).hasClass('mCustomScrollbar')) {
                                    //console.log('end');
                                    $(this).mCustomScrollbar("destroy");
                                }
                            });
                        }
                    };
                    window.matchMedia('(min-width: 768px) and (max-width: 1325px)').addListener(controlScrollX);
                    // mouse out
                    $nav.on('mouseleave', function (e) {
                        e.preventDefault();
                        isMouseOver = false;
                        //console.log(e.target);
                        var $target = $(e.target);
                        if ($target.hasClass('sublayer-inner') || $target.hasClass('sublayer') || $target.hasClass('navi-top')) {
                            $depthLink.removeClass('active');
                            $nav.find('.tablet-layer').removeClass('active');
                        }
                        var $window = $(window).width();
                        var dt = 768;
                        if (dt <= $window) {
                            if ($(this).find('.slick-dot-wrap .slide-pause').hasClass('pause')) {
                                $(this).find('.slick-dot-wrap .slide-pause.pause').trigger('click');
                            }
                        }
                    });
                    $nav.find('.navi-top').on('mouseenter', function (e) {
                        e.preventDefault();
                        isMouseOver = false;
                        $depthLink.removeClass('active');
                        $nav.find('.tablet-layer').removeClass('active');
                    });
                    // right icons and search
                    $iconBtn.on('click focus mouseenter', function (e) {
                        e.preventDefault();
                        var $others = $(this).closest('.icons').find('>div>a');
                        $others.not($(this)).next('div').removeClass('active');
                        if ($(this).next('div').length > 0) {
                            if ($(this).parent().hasClass('search') && e.type != "click") {
                                return false;
                            } else {
                                $(this).next('div').addClass('active');
                            }
                            if ($(this).parent().hasClass('search')) {
                                $(this).next('.gnb-search-layer').find('.search-input input.input').focus();
                            }
                        } else {
                            if(e.type=='click') {
                                location.href=$(this).attr('href');
                            }
                            return true;

                        }
                        // close menu layer
                        if ($nav.find('.depth1 > li > a.active, .depth2 li > a.active').length > 0) {
                            $nav.find('.depth1 > li > a.active, .depth2 li > a.active').removeClass('active');
                        }

                        // control tablet layer area
                        $('.tablet-layer').empty().removeClass('active');
                    });
                    $icons.on('mouseleave', function (e) {
                        e.preventDefault();
                        //console.log(e.target);
                        if (!$(':focus').is($searchInput) && !$(e.target).hasClass('login')) {
                            var $others = $(this).find('>div>a+div');
                            $others.removeClass('active');
                        }
                    });
                    $searchInput.off().on('keyup input', function (e) {
                        e.preventDefault();

                        // close other layer
                        $nav.find('.for-desktop .left-btm ul.depth1>li>a.active').removeClass('active');
                        $nav.find('.for-desktop .left-btm ul.depth2 li>a').removeClass('active');
                        $nav.find('.tablet-layer').removeClass('active');

                        var $searchForm = $(this).closest('.search').find('.gnb-search-form');
                        var txt = $(this).val();
                        var url = $(this).data('predictive-url');
                        var param = $searchForm.serialize();
                        if (txt.length >= 1) {
                            ajax.call(url, param, 'html', function (data, _this) {
                                if (!data || data == '') {
                                    $searchForm.find('.search-result-layer').removeClass('active').empty();
                                } else {
                                    $searchForm.find('.search-result-layer').addClass('active').html(data);
                                    $searchForm.find('.search-result-layer').find('.search-layer .enhanced-products ul li .txt a.product').off('click').on('click', function() {
                                        window.adobeTrackEvent('gnb-search-product', {search_keyword : $(this).closest('.gnb-search-form').find('.search-input input').val(), page_event : {predictive_search_click : true}});
                                    });
                                }
                            });
                        } else {
                            $searchForm.find('.search-result-layer').removeClass('active').empty();
                        }
                    });
                    $('body').on('click touchend', function (e) {
                        if (!$(e.target).parents('.navigation')[0]) {
                            $nav.find('.gnb-search-layer.active').removeClass('active');
                        }
                    });
                    // close sublayer
                    $closeSubLayer.on('click', function (e) {
                        e.preventDefault();
                        $(this).closest('.sublayer').parent().find('>a').removeClass('active');
                    });

                    // feature box
                    var featureSlick = function () {
                        var $featureObj = $nav.find('.gnb-feature');
                        $featureObj.each(function () {
                            var _this = $(this);
                            $(this).find('.feature-box').slick({
                                autoplay: true,
                                autoplaySpeed: 5000,
                                infinite: false,
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                arrows: true,
                                dots: true,
                                appendDots: $(this).find('.dot-box'),
                                responsive: [
                                    {
                                        breakpoint: 768,
                                        settings: {
                                            variableWidth: true
                                        }
                                    }
                                ]
                            });
                            $(this).find('.slick-dot-wrap .slide-pause').on('click', function () {
                                if ($(this).hasClass('pause')) {
                                    $(this).removeClass('pause').addClass('play');
                                    $(this).text($(this).attr('data-title-play'));
                                    _this.find('.feature-box').slick('slickPause');
                                } else {
                                    $(this).removeClass('play').addClass('pause');
                                    $(this).text($(this).attr('data-title-stop'));
                                    _this.find('.feature-box').slick('slickPlay');
                                }

                            });
                            $(this).find('.slick-dot-wrap .slide-pause').trigger('click');
                        });
                    };
                    featureSlick();

                    // mobile view
                    var scrollToTop = function ($obj) {
                        var t = $obj.closest('.navigation').offset().top;
                        //console.log(t);
                        $('html, body').stop().animate({scrollTop: t}, 300);
                    };
                    // close search layer in mobile view
                    $nav.find('.gnb-search-layer .search-close a').off('click').on('click', function (e) {
                        e.preventDefault();
                        $(this).closest('.gnb-search-layer').removeClass('active');
                    });
                    // bind click event in mobile view
                    var $mobileNav = $nav.find('.for-mobile');
                    var $mobileMenu = $mobileNav.find('.menu');
                    var $mobileDepth1 = $mobileNav.find('.depth1-m');
                    var $mobileTopMenu = $mobileNav.find('.top-link');
                    var $mobileMyLG = $mobileNav.find('.mylg');
                    var $mobileBack = $mobileNav.find('.back');
                    //var $mobileLogged = $mobileNav.find('.mylg .login.logged');
                    var $mobileExpand = $mobileNav.find('.depth2-m .expand');
                    $mobileMenu.find('>a').on('click', function (e) {
                        e.preventDefault();
                        $(this).parent().toggleClass('open').find('.menu-wrap').toggleClass('active');

                        // active current page
                        if($nav.find('.for-mobile').find('.current-page').length==1) {
                            var $currMenu = $nav.find('.for-mobile').find('.current-page');
                            if($currMenu.is('.type2') || $currMenu.closest('.type3').length>0 || $currMenu.is('.expand')) {
                                $currMenu.closest('.sublayer-m').addClass('active').siblings().removeClass('active');
                                if($currMenu.closest('.sub').length>0) {
                                    $currMenu.closest('.sub').prev().addClass('active').siblings().removeClass('active');
                                }
                            } else if($currMenu.parent().parent().is('.type1')) {

                            }
                        } else {
                            $mobileDepth1.addClass('active');
                            $mobileTopMenu.addClass('active');
                            $mobileMyLG.addClass('active');
                            $(this).parent().find('.sublayer-m').removeClass('active');
                        }
                        scrollToTop($(this));
                    });
                    $mobileDepth1.find('>li>a').on('click', function (e) {
                        e.preventDefault();
                        var targetID = $(this).attr('href').split('#')[1];
                        if (targetID && targetID.length > 0) {
                            var $target = $('#' + targetID);
                            $mobileDepth1.removeClass('active');
                            $mobileTopMenu.removeClass('active');
                            $mobileMyLG.removeClass('active');
                            $target.addClass('active');
                            scrollToTop($(this));
                        }
                    });
                    $mobileBack.find('>a').on('click', function (e) {
                        e.preventDefault();
                        $mobileDepth1.addClass('active');
                        $mobileTopMenu.addClass('active');
                        $mobileMyLG.addClass('active');
                        $(this).closest('.sublayer-m').removeClass('active');
                        scrollToTop($(this));
                    });
                    $mobileExpand.find('>a').on('click', function (e) {
                        e.preventDefault();
                        $(this).parent().toggleClass('active');
                    });

                    loginCheck();
                }
            }());

// top btn
            (function () {
                if (!document.querySelector('.floating-menu')) return false;

                var floatingMenu = function () {
                    var $this = $(".floating-menu"),
                        p = floatingMenu.prototype;

                    p.init = function () {
                        this.elements.$toTop.on("click", function (e) {
                            e.preventDefault();
                            $("html, body").stop().animate({
                                scrollTop: 0
                            }, 600);
                        });
                        $(window).on("scroll", function () {
                            var scrollPos = $(window).scrollTop(),
                                h = $('header.navigation').outerHeight();
                            if (!$this.hasClass('call-yet') && (scrollPos <= h)) {
                                $this.addClass("call-yet");
                            } else if ($this.hasClass('call-yet') && (scrollPos > h)) {
                                $this.removeClass("call-yet");
                            }
                        });
                    };
                    p.elements = {
                        $toTop: $this.find(".back-to-top"),
                        $chatbot: $this.find(".chatbot-linker")
                    };
                    p.init();
                };
                floatingMenu();
            }());

// footer
            (function ($) {
                var appFooter = function () {
                    var footerObj = $('.footer-main-contents');
                    var footerTarget = footerObj.find('.visible-mobile');
                    var footerDepth1 = footerTarget.find('.has-category');
                    footerDepth1.on('click', function (e) {
                        if ($(this).hasClass('on')) {
                            return true;
                        } else {
                            $(this).addClass('on');
                            $(this).next().slideDown(200);
                            $(this).append('<a href="#" class="button-layer"></a>');
                            layerButton();
                            return false;
                        }
                    });
                };
                var layerButton = function () {
                    $('.button-layer').off("click").on('click', function () {
                        $(this).parent().removeClass('on');
                        $(this).parent().next().slideUp(200);
                        $(this).off("click").remove();
                        return false;
                    });
                };
                appFooter();
            })(jQuery);

// Share
            (function ($) {
                if (!document.querySelector('.share-common') && !document.getElementById('modal_help_library')) return false;
                initShareCommon = function () {
                    var shareObj = $('.share-common');
                    var sharePrint = shareObj.find('.article-print');
                    var shareEmail = shareObj.find('.article-email');
                    var shareLink = shareObj.find('.article-link');
                    //share
                    var shareFB = shareObj.find('.share-facebook');
                    var shareTW = shareObj.find('.share-twitter');
                    var sharePI = shareObj.find('.share-pinterest');
                    //question section
                    var shareModal = $('#modal_resource_search_copylink');
                    $(document)
                        .on("click", "[type=submit][form]", function (event) {
                            event.preventDefault();
                            var formId = $(this).attr("form"),
                                $form = $("#" + formId).submit();
                        })
                        .on("keypress", "form input", function (event) {
                            var $form;
                            if (event.keyCode == 13) {
                                $form = $(this).parents("form");
                                if ($form.find("[type=submit]").length == 0 &&
                                    $("[type=submit][form=" + $(this).attr("form") + "]").length > 0) {
                                    $form.submit();
                                }
                            }
                        });

                    // adobe
                    function adobeShare(obj, name) {
                        // for PDP
                        if ($('.C0009').length>0) {
                            window.adobeTrackEvent('share-print', {
                                products: [{sales_model_code : $('.C0009').data('adobe-salesmodelcode'), model_name: $('.C0009').data('adobe-modelname')}],
                                social_service_name: name,
                                page_event: {sns_share: true}
                            });
                        } else {
                            window.adobeTrackEvent('sns-share', {social_service_name: name, page_event: {sns_share: true}});
                        }
                    }
                    sharePrint.off('click').on('click', function (e) {
                        e.preventDefault();
                        adobeShare($(this), 'print');
                        window.print();
                    });
                    shareEmail.off('click').on('click', function (e) {
                        e.preventDefault();
                        adobeShare($(this), 'email');
                        var title = encodeURIComponent(document.title),
                            hashCheck = new RegExp(/\#$/g);
                        if(hashCheck.test(location.href)) {
                            url = encodeURIComponent(location.href.replace(/\#$/g, ''));
                        }else {
                            url = encodeURIComponent(location.href);
                        }

                        if($(this).closest('.modal').length>0 && $(this).parent().find('.article-link').length>0) {
                            // help library in modal (ex. symptoms)
                            url = $(this).parent().find('.article-link').attr('data-url');
                        }

                        var mailto = 'mailto:?subject=' + title + '&body=' + url;
                        location.href = mailto;

                    });
                    shareLink.off('click').on('click', function (e) {
                        e.preventDefault();
                        adobeShare($(this), 'link');
                        //var ClipboardCopy = location.href;
                        url = $(this).data('url');
                        Clipboard.copy(url);
                        shareModal.find('.modal-url').text(url);
                    });
                    shareFB.off('click').on('click', function (e) {
                        e.preventDefault();
                        adobeShare($(this), 'facebook');
                        url = $(this).data('url');
                        sendShareFb(url);
                    });
                    shareTW.off('click').on('click', function (e) {
                        e.preventDefault();
                        adobeShare($(this), 'twitter');
                        url = $(this).data('url');
                        title = $(this).data('title');
                        via = $(this).data('via');

                        // converting short Url script
                        var shortUrl = e.currentTarget.getAttribute("data-short-url");
                        if(shortUrl && shortUrl != null) {
                            sendShareTw(shortUrl, title, via);
                        }else {
                            var ajaxData = $(this).closest(".sns-share").data();
                            if(ajaxData.paramName) {
                                var shortUrlParam = ajaxData.paramName+"="+url;
                                // ajax.call(ajaxData.getUrl, shortUrlParam, 'jsonp', function (data) {
                                // 	if(data && (data.shortUrl && data.shortUrl != null)) {
                                // 		e.currentTarget.setAttribute("data-short-url", data.shortUrl);
                                // 		sendShareTw(data.shortUrl, title, via);
                                // 	}else {
                                // 		sendShareTw(url, title, via);
                                // 	}
                                // });
                                var ajaxUrl = 'https://www.lg.com/common/shorturl/getShortUrl.lgajax';
                                if(ajaxData.getUrl) {
                                    ajaxUrl = ajaxData.getUrl;
                                }
                                $.ajax({
                                    type: "GET",
                                    timeout: 5e4,
                                    url: ajaxUrl,
                                    data: shortUrlParam,
                                    dataType: "jsonp",
                                    jsonp: "callback",
                                    success: $.proxy(function(data) {
                                        sendShareTw(data.shortUrl, title, via);
                                        //console.log(data);
                                    }, this)
                                });
                            }else {
                                sendShareTw(url, title, via);
                            }
                        }
                    });
                    sharePI.off('click').on('click', function (e) {
                        e.preventDefault();
                        adobeShare($(this), 'pinterest');
                        url = $(this).data('url');
                        title = $(this).data('title');
                        image = $(this).data('image');
                        sendSharePi(url, title, image);
                    });

                    function openSns(url) {
                        var winObj;
                        winObj = window.open(url, "New Window", "width=600, height=800,scrollbars=yes");
                    }

                    function sendShareFb(url) {
                        var shareurl = (url) ? url : document.location.href;
                        url = "http://www.facebook.com/sharer/sharer.php?u=" + shareurl;
                        openSns(url);
                    }

                    function sendShareTw(url, title, via) {
                        var shareurl = (url) ? url : document.location.href;
                        var text = (title) ? title : $("head title").text();
                        var via2 = (via) ? via : 'LGUS';
                        url = "https://twitter.com/intent/tweet?url=" + shareurl + "&text=" + encodeURIComponent(text) + "&via=" + via2;
                        openSns(url);
                    }

                    function sendSharePi(url, title, image) {
                        var shareurl = (url) ? url : document.location.href;
                        var text = (title) ? title : $("head title").text();
                        var img = (image) ? image : $("meta[property='og:image']").attr('content');
                        url = "http://www.pinterest.com/pin/create/button/?url=" + encodeURIComponent(shareurl) + "&media=" + encodeURIComponent(img) + "&description=" + encodeURIComponent(text);
                        openSns(url);
                    }

                    window.Clipboard = (function (window, document, navigator) {
                        var textArea,
                            copy;

                        function isOS() {
                            return navigator.userAgent.match(/ipad|iphone/i);
                        }

                        function createTextArea(text) {
                            textArea = document.createElement('textArea');
                            textArea.value = text;
                            textArea.style.position = 'fixed';
                            textArea.style.top = '0';
                            textArea.style.left = '0';
                            textArea.style.opacity = '0.0001';
                            textArea.style.width = '100%';
                            textArea.style.height = '100%';
                            textArea.style.padding = '0';
                            textArea.style.pointerEvents = "none";
                            textArea.style.fontSize = '16px';


                            document.body.appendChild(textArea);
                        }

                        function selectText() {
                            var range,
                                selection;

                            if (isOS()) {
                                range = document.createRange();
                                range.selectNodeContents(textArea);
                                selection = window.getSelection();
                                selection.removeAllRanges();
                                selection.addRange(range);
                                textArea.setSelectionRange(0, 999999);
                            } else {
                                textArea.select();
                            }
                        }

                        function copyToClipboard() {
                            document.execCommand('copy');
                            document.body.removeChild(textArea);
                        }

                        copy = function (text) {
                            createTextArea(text);
                            selectText();
                            copyToClipboard();
                        };
                        return {
                            copy: copy
                        };
                    })(window, document, navigator);
                };
                initShareCommon();
            })(jQuery);

// Script to run before and After Printing
            (function () {
                // Script to run before printing
                var beforePrint = function () {
                    // lazyload image
                    if ($('img.lazyload').length > 0) {
                        $('img.lazyload').each(function () {
                            $(this).attr('src', $(this).data('src')).removeClass('lazyload').addClass('lazyloaded');
                        });
                    }
                };
                // Script to run after printing
                var afterPrint = function () {
                    // alert('Functionality to run after printing');
                };
                if (window.matchMedia) {
                    var mediaQueryList = window.matchMedia('print');
                    mediaQueryList.addListener(function (mql) {
                        if (mql.matches) {
                            beforePrint();
                        } else {
                            afterPrint();
                        }
                    });
                }
                window.onbeforeprint = beforePrint;
                window.onafterprint = afterPrint;
            }());

// ESC key control
            (function () {
                $(document).keyup(function (e) {
                    if (e.keyCode == 27) { // escape key maps to keycode `27`
                        // Close GNB Layer
                        $('.navigation .for-desktop ul.depth1 li>a, .navigation .for-desktop ul.depth2 li>a, .navigation .for-desktop .tablet-layer, .navigation .gnb-login, .navigation .gnb-search-layer, .navigation .for-mobile .menu .menu-wrap').removeClass('active');
                        $('.navigation .for-mobile .menu').removeClass('open');
                        // Close Search Layer
                        $('.search-area .search-layer').removeClass('active');
                        // Close Tooltip Layer
                        $('.tooltip-area').removeAttr('style');
                        // video layer
                        $('.video-modal').remove();
                    }
                });
            }());

// HTML Open Error
            function htmlOpenError(htmldowntime, htmlopentime) {
                if ($('#htmlOpenError').length > 0) {
                    if (htmldowntime) $('#htmlOpenError .htmldowntime').html(xssfilter(htmldowntime));
                    if (htmlopentime) $('#htmlOpenError .htmlopentime').html(xssfilter(htmlopentime));
                    $('#htmlOpenError').modal();
                }
            }

// pagination branch
            var isMobile;
            (function ($) {
                isMobile = $('header.navigation').is('.mobile-device');
                var $pagination = $('.pagination'),
                    $expander = $('.expander');
                if ($pagination.length > 0 && $expander.length > 0) {
                    if (isMobile) {
                        $pagination.hide();
                        $expander.show();
                    } else {
                        $pagination.show();
                        $expander.hide();
                    }
                }
            })(jQuery);

// skip to contents
            (function ($) {
                // init
                var $navWrap = $('.navigation').closest('.container-fluid');
                if ($navWrap.length > 0) {
                    var $target = $navWrap.next().find('div').not('div[id]').eq(0);
                    if($target.hasClass('add-filter')) $target = $target.next();
                    $target.attr('id', 'lgContents');
                }
                // click
                var $obj = $('.skip_nav a');
                $obj.off('off').on('click', function (e) {
                    e.preventDefault();
                    var link = $(this).attr('href').split('#')[1];
                    if ($('#'+link).length > 0) {
                        $('#'+link).eq(0).attr('tabindex', 0).focus();
                        if(link=='lgAccHelp' && $('.C0022.active').length>0) {
                            $('.C0022.active').removeClass('showing');
                        }
                    }
                });
            })(jQuery);

// page count
            (function ($) {
                // usage
                // <div class="js-page-count" data-count-url="/data-ajax/mkt/pageCount.json" data-param="modelId=testmodelId"></div>
                var $el = $('.js-page-count');
                if ($el.length > 0) {
                    $el.each(function () {
                        var url = $(this).data('count-url');
                        var param = $(this).data('param');
                        if (url && param) {
                            ajax.call(url, param, 'json', function (data) {
                                // do nothing
                            });
                        }
                    });
                }
            })(jQuery);

// adobe (cs > psp page > download)
            (function ($) {
                if($('.support-downloads').length>0) {
                    $obj=$('.support-downloads .list>li .name a.link-text');
                    $obj.on('click', function() {
                        var fileName = "";
                        if($(this).closest('li').hasClass('manuals')) {
                            // cs > psp page > Manuals & Documents
                            var $pobj = $('.support-product-area .text-block .model');
                            var tempname = $pobj.text();
                            if($pobj.find('.name').length>0) tempname = tempname.replace($pobj.find('.name').text(), '');
                            fileName = changeTitleFormat($(this).closest('li').find('.type').text()) + ':' + changeTitleFormat(tempname) + ':' + changeTitleFormat($(this).text());
                            window.adobeTrackEvent('cs-psp-download', {download_file_type : "manuals_documents", download_file_name: fileName, page_event : {cs_file_download : true}});
                        } else if($(this).closest('li').hasClass('software')) {
                            // cs > psp page >Software & Drivers
                            var $pobj2 = $('.support-product-area .text-block .model');
                            var tempname2 = $pobj2.text();
                            if($pobj2.find('.name').length>0) tempname2 = tempname2.replace($pobj2.find('.name').text(), '');
                            fileName = changeTitleFormat($(this).closest('li').find('.type').text()) + ':' + changeTitleFormat(tempname2) + ':' + changeTitleFormat($(this).text());
                            window.adobeTrackEvent('cs-psp-download', {download_file_type : "software_drivers", download_file_name: fileName, page_event : {cs_file_download : true}});
                        }
                    });
                }
            })(jQuery);

// adobe (cs > dispatch portal > sign out)
            (function ($) {
                $('.user-info-wrap .extra-area a.btn-exception-outline-xs').click(function() {
                    window.adobeTrackEvent('cs-dispatch-portal-signout', {page_event : {partner_sign_out : true}});
                });
            })(jQuery);

            cart.init(options);
        };

        /* fix performance */
        $.getJSON(options.tokenStorageUrl,{}, function (response) {
            var token = '';
            if (response) {
                token = response;
            }

            init(token);
        });


    //Handle search button click on obs
        $('body').on('click','.navi-btm .icons .search a, .navigation .for-mobile .left .search a', function(e) {
            e.preventDefault();
            let id = '#navigation_search';
            let formContainer = $(id);
            let formContentUrl = formContainer.attr('data-child-html');
            if(formContainer.hasClass('bound')) {
                formContainer.addClass('active');
                return;
            }
            let url = window.BASE_URL+'/rest/V1/fetch-prevent-cors?url='+formContentUrl;
            $.ajax({
                method: 'POST',
                url: formContentUrl,
                success: function(data) {
                    let isFail = $(data).find('script').length;
                    if(isFail) {
                        console.log('calling search form fail');
                    } else {
                        $(formContainer).html(data);
                        $(formContainer).addClass('active bound');
                        $(formContainer).find('button.btn-close-search-window').click(function() {
                            $(formContainer).removeClass('active');
                        })
                        $(formContainer).find('a[data-keyword=true]').click(function() {
                            let search = $(this).text();
                            $(formContainer).find('#useInputKeyword').val(search);
                            $(formContainer).find('#searchByKeyword').trigger('click');
                            return false;
                        })
                    }
                }
            }).fail(function() {
                $.get(url, function( data ) {
                    let isFail = $(data).find('title').length;
                    if(isFail) {
                        console.log(data);
                    } else {
                        $(formContainer).html(data);
                        $(formContainer).addClass('active bound');
                        $(formContainer).find('button.btn-close-search-window').click(function() {
                            $(formContainer).removeClass('active');
                        })
                        $(formContainer).find('a[data-keyword=true]').click(function() {
                            let search = $(this).text();
                            $(formContainer).find('#useInputKeyword').val(search);
                            $(formContainer).find('#searchByKeyword').trigger('click');
                            return false;
                        })
                    }

                })
            })
        })
    };
});
