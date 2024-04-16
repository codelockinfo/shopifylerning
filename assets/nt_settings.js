var T4stt_var = { 
  "disabled_ver_console":false,
  "CartAttrHidden":true,
  "theme_ver":"Gecko Shopify v5.6.1",
  "scrollTop":100,
  "pjaxTimeout":5000,
  "HoverInterval":35,
  "HoverTimeout":150,
  "dragThreshold":10,
  "prevOnHref":false,
  "zoom_mb":true,
  "show_confetti":true,
  "sw_limit_click":false,
  "backtop":"3",
  "pagination":null,
  "review":false,
  "app_review":"1",
  "ajax_scroll":false,
  "ajax_shop":true,
  "ajax_scroll_offset":"100",
  "ntla_ck":false,
  "pr_curent":"3",
  "use_clicking_vimg":true,
  "enableHistoryState":false,
  "pr_incoming_mess":false,
  "use_notify_me":true,
  "use_vimg":true,
  "use_sticky_des":false,
  "wishlist_type":"1",
  "wis_atc_added":"1",
  "shop_filters":true,
  "type_filters":"1",
  "auto_hide_ofsock":false,
  "show_hide_ofsock":false,
  "disOnlyStock":false,"disATCerror":false,"close":"Close (Esc)",
   "share_fb":"Share on Facebook",
   "pin_it":"Pin it",
   "tweet":"Tweet",
   "download_image":"Download image",
   "img_captions":true,
   "z_magnify":2,
   "z_touch":false,
   "galleryType":"pswp","maxSpreadZoom":1,
   "bgOpacity":1,
   "currencies":true,
   "currency_visitor":false,
   "currency_format":"money_format",
   "round_currency":false,
   "hover_currency":false,
   "remove_currency":false,
   "round_cur_shop":false,
   "after_action_atc":"3",
   "ins_host":"https://d3ejra0xbg20rg.cloudfront.net",
  "timezone":"not4",
  "zoom_tp":"2",
  "search_prefix":'*',
  "platform_email":"1",
  "checkbox_mail":false,
  "edit_item":"0" 
};
// https://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically 
// not support IE 11
//var nt_settings = {...T4stt_var, ...T4stt_str};
// polyfill Object.assign
if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource !== null && nextSource !== undefined) {
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}
var nt_settings = Object.assign({}, T4stt_var, T4stt_str);
