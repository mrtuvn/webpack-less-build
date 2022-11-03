/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 * 
 * When the page loads, this object looks for an id selector in local storage, if it finds one 
 * for the given local storage key, it will focus that DOM object.
 * 
 * When the pager sets a new page, it will store a key in local storage.
 */

define([
  'jquery',
], function ($) {
  'use strict';
  return function(config, node) {
    let key = localStorage.getItem("pagerSelectedId");

    if (key) {
      $("#" + key).focus();

      localStorage.removeItem("pagerSelectedId");
    }
    
    $(node).change(function() {
      let id = $(node).attr("id");

      localStorage.setItem("pagerSelectedId", id);
    });

  }
}); 