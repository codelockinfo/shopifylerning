(function( $ ) {
   "use strict";
    var body = $('body'),
	    $RecoverHeading = $('#RecoverHeading'),
	    $RecoverEmail = $('#RecoverEmail'),
	    $LoginHeading = $('#LoginHeading'),
	    $wrapperId = $("#response_calcship"),
	    $ld = $('#ld_cl_bar'),
	    nt_js_cart = $('.nt_js_cart');

   geckoShopify.initEventListeners = function () {

	    // Show reset password form
	    $('#RecoverPassword').on('click', function(evt) {
	        evt.preventDefault();
	        showRecoverPasswordForm();
	        $RecoverHeading.attr('tabindex', '-1').focus();
	      }.bind(this)
	    );

	    // Hide reset password form
	    $('#HideRecoverPasswordLink').on('click', function(evt) {
	        evt.preventDefault();
	        hideRecoverPasswordForm();
	        $LoginHeading.attr('tabindex', '-1').focus();
	      }.bind(this)
	    );

	    $RecoverHeading.on('blur', function() {
	      $(this).removeAttr('tabindex');
	    });

	    $LoginHeading.on('blur', function() {
	      $(this).removeAttr('tabindex');
	    });
   };

   // Show/Hide recover password form
  function showRecoverPasswordForm() {
    $('#RecoverPasswordForm').removeClass('hide');
    $('#CustomerLoginForm').addClass('hide');

    if ($RecoverEmail.attr('aria-invalid') === 'true') {
      $RecoverEmail.focus();
    }
  };

  function hideRecoverPasswordForm() {
    $('#RecoverPasswordForm').addClass('hide');
    $('#CustomerLoginForm').removeClass('hide');
  };

   // Show reset password success message
   geckoShopify.resetPasswordSuccess = function () {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess')
      .removeClass('hide')
      .focus();
   };

   // Show/hide customer address forms
   geckoShopify.customerAddressForm = function () {
	    var $newAddressForm = $('#AddressNewForm');
	    var $newAddressFormButton = $('#AddressNewButton');

	    if (!$newAddressForm.length) {
	      return;
	    }

	    // Initialize observers on address selectors, defined in shopify_common.js
	    if (Shopify) {
	      // eslint-disable-next-line no-new
	      new Shopify.CountryProvinceSelector('AddressCountryNew','AddressProvinceNew', {
	          hideElement: 'AddressProvinceContainerNew'
	      });
	    }

	    // Initialize each edit form's country/province selector
	    $('.address-country-option').each(function() {
	      var formId = $(this).data('form-id');
	      var countrySelector = 'AddressCountry_' + formId;
	      var provinceSelector = 'AddressProvince_' + formId;
	      var containerSelector = 'AddressProvinceContainer_' + formId;

	      // eslint-disable-next-line no-new
	      new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
	        hideElement: containerSelector
	      });
	    });

	    // Toggle new/edit address forms
	    $('.address-new-toggle').on('click', function() {
	      var isExpanded = $newAddressFormButton.attr('aria-expanded') === 'true';

	      $newAddressForm.toggleClass('hide');
	      $newAddressFormButton.attr('aria-expanded', !isExpanded).focus();
	    });

	    $('.address-edit-toggle').on('click', function() {
	      var formId = $(this).data('form-id');
	      var $editButton = $('#EditFormButton_' + formId);
	      var $editAddress = $('#EditAddress_' + formId);
	      var isExpanded = $editButton.attr('aria-expanded') === 'true';

	      $editAddress.toggleClass('hide');
	      $editButton.attr('aria-expanded', !isExpanded).focus();
	    });

	    $('.address-delete').on('click', function() {
	      var $el = $(this);
	      var target = $el.data('target');
	      var confirmMessage = $el.data('confirm-message');

	      // eslint-disable-next-line no-alert
	      if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
	        Shopify.postLink(target, {
	          parameters: { _method: 'delete' }
	        });
	      }
	    });
	};

   // Check URL for reset password hash
   geckoShopify.checkUrlHash = function () {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      showRecoverPasswordForm.bind(this)();
    }
  };

	// geckoShopify.pollForCartShippingRatesForDestination = function(o, a, t) {
	//     t = t || Shopify.onError;
	//     var n = function() {
	//         $.ajax("/cart/async_shipping_rates", {
	//             dataType: "json",
	//             success: function(t, r, e) {
	//                 200 === e.status ? "function" == typeof a ? a(t.shipping_rates, o) : Shopify.onCartShippingRatesUpdate(t.shipping_rates, o) : setTimeout(n, 500)
	//             },
	//             error: t
	//         })
	//     };
	//     return n
	// };
	
	// geckoShopify.getCartShippingRatesForDestination = function(t, r, e) {
	//     e = e || Shopify.onError;
	//     var o = {
	//         type: "POST",
	//         url: "/cart/prepare_shipping_rates",
	//         data: Shopify.param({
	//             shipping_address: t
	//         }),
	//         success: Shopify.pollForCartShippingRatesForDestination(t, r, e),
	//         error: e
	//     };
	//     $.ajax(o)
	// };

	// geckoShopify.onCartShippingRatesUpdate = function(t, r) {
	//     var e = "";
	//     r.zip && (e += r.zip + ", "),
	//     r.province && (e += r.province + ", "),
	//     e += r.country,
	//     alert("There are " + t.length + " shipping rates available for " + e + ", starting at " + Shopify.formatMoney(t[0].price) + ".")
	// };



	geckoShopify.estimatedShippingRates = function() {
      var _zip = $('#address_zip_ship'),
         _country = $('#address_country_ship'),
         _province = $('#address_province_ship');

    body.on('click', '.get_rates', function(evt) {
      
      var _this = $(this);
      $ld.trigger( "ld_bar_star" );
      _this.addClass('pe_none');
      // Reading shipping address for submission.
      var shippingAddress = {};
      shippingAddress.zip = _zip.val() || '';
      shippingAddress.country = _country.val() || '';
      shippingAddress.province = _province.val() || '';
      // _getCartShippingRatesForDestination(shippingAddress);
	    var params = {
	        type: "POST",
	        url: "/cart/shipping_rates.json",
	        data: $.param({
	            shipping_address: shippingAddress
	        }),
          success: function( response ) {
          	// console.log('aaa');
			   $wrapperId.empty().hide();
          	geckoShopify.onCartShippingRatesUpdate(response.shipping_rates, shippingAddress);
          	// geckoShopify.HideNotices();
          	if (sp_nt_storage) { localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress)) }
          },
		    error: function(XMLHttpRequest, textStatus) {
		    	// console.log('bbb');
			   $wrapperId.empty().hide();
		      _onError(XMLHttpRequest, textStatus)
		    },
		    complete: function() {
			   // Hiding response.
		    	$ld.trigger( "ld_bar_end" );
		    	_this.removeClass('pe_none');
		    }
	    };
	    $.ajax(params)
    });

	  var _fullMessagesFromErrors = function(errors) {
	    var fullMessages = [];
	    $.each(errors, function(attribute, messages) {
	      $.each(messages, function(index, message) {
	        fullMessages.push(attribute + " " + message)
	      })
	    });
	    return fullMessages
	  };
	  var _onError = function(XMLHttpRequest, textStatus) {
	    // $("#estimated-shipping").hide();
	    // $("#estimated-shipping em").empty();
	    //_enableButtons();
	    var feedback = "";
	    var data = eval("(" + XMLHttpRequest.responseText + ")");
	    if (!!data.message) {
	      feedback = data.message + "(" + data.status + "): " + data.description
	    } else {
	      feedback = "Error : " + _fullMessagesFromErrors(data).join("; ")
	    }
	    if (feedback === "Error : country is not supported.") {
	      feedback = nt_settings.no_rates
	    }
	    //geckoShopify.CreatNotices(feedback);
	    $wrapperId.html('<div class="shippingcalc_mess">'+feedback+'</div>').fadeIn();
	    //$wrapperId.show()
	  };

	   // We don't wait for customer to click if we know his/her address.
	   // if (_country.hasClass('has_address') || body.hasClass('logged-in')) {
	   //   $('.get_rates:eq(0)').trigger('click');
	   // }
   };

	geckoShopify.onCartShippingRatesUpdate = function(rates, shipping_address) {
	    //_enableButtons();
	    var readable_address = "";
	    if (shipping_address.zip) {
	      readable_address += shipping_address.zip + ", "
	    }
	    if (shipping_address.province) {
	      readable_address += shipping_address.province + ", "
	    }
	    readable_address += shipping_address.country;
	    // if (rates.length) {
	    //   if (rates[0].price == "0.00") {
	    //     $("#estimated-shipping em").html("FREE")
	    //   } else {
	    //     $("#estimated-shipping em").html(_formatRate(rates[0].price))
	    //   }
	    // }
	    // console.log(rates)
        if (rates.length > 1) {
          var firstRate = geckoShopify.formatMoney(rates[0].price);
          var message = nt_settings.multiple_rates.replace('[number_of_rates]', rates.length).replace('[address]', readable_address).replace('[rate]', firstRate);
        } else if (rates.length === 1) {
          var message = nt_settings.one_rate.replace('[address]', readable_address);
        } else {
          var message = nt_settings.no_rates;
        }
        //console.log(message)
       
        //console.log(rates);
		var ratesList = '';
		$.each( rates, function( i, rate ) {
		  //console.log(rate.price);
          var price = geckoShopify.formatMoney(rate.price);
          var rateValue = nt_settings.rate_value.replace('[rate_title]', rate.name).replace('[rate]', price);
          //return '<li>${rateValue}</li>';
          ratesList += '<li>'+rateValue+'</li>';
		});
        // var ratesList = rates.map(rate => {
        //   var price = geckoShopify.formatMoney(rate.price);
        //   var rateValue = nt_settings.rate_value.replace('[rate_title]', rate.name).replace('[rate]', price);
        //   //return '<li>${rateValue}</li>';
        //   return '<li>'+rateValue+'</li>';
        // });
        //console.log(ratesList);
	    $wrapperId.html('<div class="shippingcalc_mess">'+message+'</div><div class="shippingcalc_rate"><ul>'+ratesList.toString().replace(/<\/li>,<li>/g, "</li><li>")+'</ul></div>').fadeIn();
	    body.trigger('refresh_currency');
	};

   geckoShopify.AddressShip = function () {
	    if (!Shopify) return;
	      // eslint-disable-next-line no-new
	      new Shopify.CountryProvinceSelector('address_country_ship','address_province_ship', {
	          hideElement: 'address_province_container_ship'
	      });
   };

   geckoShopify.cart_tls_ship = function () {
      var Timeout;

		$(".js_cart_tls").click(function(e) {
	      e.preventDefault();
	      var id = $(this).data('id');
	      nt_js_cart.addClass('ld_nt_cl ld_cart_tls');
	      $('.mini_cart_'+id).addClass('is_nt_op');
	      if (id == 'note') {
          Timeout = setTimeout(function(){ $('#CartSpecialInstructions').focus(); }, 500);
	      } else if (id == 'dis') {
          Timeout = setTimeout(function(){ $('#Cartdiscode').focus(); }, 500);
	      }
		});

		$(".js_cart_tls_back").click(function(e) {
	      e.preventDefault();
	       clearTimeout(Timeout);
	      nt_js_cart.removeClass('ld_nt_cl ld_cart_tls');
	      $('.is_nt_op').removeClass('is_nt_op');
		});

   };

 //  geckoShopify.param = function(t) {

	// 	var isEmptyObject = function(t) {
	// 	    for (var r in t)
	// 	        return !1;
	// 	    return !0
	// 	};
	// 	var buildParams = function(e, t, o) {
	// 	    $.isArray(t) && t.length ? $.each(t, function(t, r) {
	// 	        rbracket.test(e) ? o(e, r) : buildParams(e + "[" + ("object" == typeof r || $.isArray(r) ? t : "") + "]", r, o)
	// 	    }) : null != t && "object" == typeof t ? isEmptyObject(t) ? o(e, "") : $.each(t, function(t, r) {
	// 	        buildParams(e + "[" + t + "]", r, o)
	// 	    }) : o(e, t)
	// 	};

	//    var e = [], r = function(t, r) {
	//         r = $.isFunction(r) ? r() : r,
	//         e[e.length] = encodeURIComponent(t) + "=" + encodeURIComponent(r)
	//    };
	//     if ($.isArray(t) || t.$)
	//         $.each(t, function() {
	//             r(this.name, this.value)
	//         });
	//     else
	//         for (var o in t)
	//             buildParams(o, t[o], r);
	//     return e.join("&").replace(/%20/g, "+")
	// };

})( jQuery_T4NT );

jQuery_T4NT(document).ready(function($) {
  
  $('#address_country_ship').addClass('lazyload').on('lazyincluded', function(e) {
      var res_address = null,
         _zip = $('#address_zip_ship'),
         _country = $('#address_country_ship'),
         _province = $('#address_province_ship');
  	   if (sp_nt_storage) {res_address = JSON.parse(localStorage.getItem('shippingAddress')) }
	   if (res_address != null) {
	   	//console.log(res_address)
	   	_country.attr("data-default",res_address.country);
	   	_province.attr("data-default",res_address.province);
	   	_zip.val(res_address.zip);
	   	_country.addClass('has_address')
	   }
    geckoShopify.AddressShip();
    geckoShopify.estimatedShippingRates();
    $('.shipping_calc_page').removeClass('loading');
  });

  geckoShopify.initEventListeners();
  geckoShopify.checkUrlHash();
  geckoShopify.resetPasswordSuccess();
  geckoShopify.customerAddressForm();
  geckoShopify.cart_tls_ship();

});