(function( $ ) {
   "use strict";
    var body = $('body'),
        nt_js_cart = $('.nt_js_cart'),
       _rtl = body.hasClass('rtl_true'),
        window_w = $(window).width(),
        small767 = (window_w < 768 && $(window).height() < 768),
       sp_notices = '#sp_notices_wrapper',
       $ld = $('#ld_cl_bar'),
       $ld_cart = $('.ld_cart_bar'),
       $ntSearch = $('#nt_search_canvas'),
       yes_hover = Modernizr.hovermq,
       ntla_ck = true,
       ck_pr_is_ungroup = true,
       productMediaTypeVideo = '[data-pr-md-tp-video]',
       productMediaTypeModel = '[data-pr-md-tp-model]',
       videos = {},
       modelJsonSections = {},
       models = {},
       xrButtons = {},
       pr_incoming_mess = nt_settings.pr_incoming_mess,
       use_notify_me = nt_settings.use_notify_me,
       save_js = nt_settings.save_js,
       enableHistoryState = nt_settings.enableHistoryState,
       use_vimg = nt_settings.use_vimg,
       use_clicking_vimg = nt_settings.use_clicking_vimg,
       search_prefix = nt_settings.search_prefix,
       PleaseChoosePrOptions = nt_settings.PleaseChoosePrOptions,
       edit_item = nt_settings.edit_item,
       show_confetti = nt_settings.show_confetti,
       cartUrl = t_cart_url,
       cartAddUrl = t_cartadd_url + '.js',
       cartChangeUrl = t_cartchange_url + '.js',
       geckoTheme = {
          popupAnimation: 'mfp-move-horizontal',
          ajaxSelector: '#cat_shopify a:not(.nav-expand-link),.cat-shop #cat_shopify a.nav-expand-link, #nt_sortby .wrap_sortby a, .nt_ajaxFilter a, .paginate_ajax a, .nav_filters a, .widget_product_tag_cloud a,a.clear_filter',
          scrollSelector: '.shopify-error a[href^="#"]',
          nt_btn_load_more : '.load-on-scroll:not(.btn--loader-active)',
          url_currency : 'https://api.teathemes.net/currency',
          money_format : '${{amount}}'
       };


    geckoShopify.Ntproduct_switch = function (variations_form, Arr_MD, product, selector, IdSelect, NtId, callBackVariant, prefix) {
      
      ntla_ck = nt_settings.ntla_ck;
      ck_pr_is_ungroup = true;
      var variants = product.variants,
            $variation_form = $(variations_form),
            ck_so_un = product.ck_so_un,
            ntsoldout = product.ntsoldout,
            remove_soldout = product.remove_soldout,
            size_ops = product.options.length,
            size_avai = product.size_avai,
            pr_id = product.id,
            ArrOP1 = [],
            ArrOP2 = [],
            ArrOP3 = [],
            mdid,
            index_click = -1;

           $(NtId + '1 .nt-swatch').each(function( index ) {
             ArrOP2.push($(this).data('escape')+'');
           });
           $(NtId + '2 .nt-swatch').each(function( index ) {
             ArrOP3.push($(this).data('escape')+'');
           });        
        
           // if (ck_so_un && ArrOP2.length <= 1 && ArrOP3.length <= 1) {
           //   var Ntsoldout = getVariantFromSize(0,false,variants),
           //       is, ls = Ntsoldout.length;
             
           //   for (is = 0; is < ls; is++) {
           //     var ntvariant = Ntsoldout[is];
           //     //console.log(variant);
           //     $(NtId + '0 .nt-swatch').eq(ArrOP1.indexOf(ntvariant.option1)).addClass('nt_soldout');
           //   }
           // }

           if (ck_so_un && size_avai.indexOf(0) > -1) {
              //console.log(size_avai);
             
             $(NtId + '0 .nt-swatch').each(function( index ) {
               if (size_avai[index] == 0) {
               $(this).addClass('nt_soldout');
               }
             });
             
           }
        //$variation_form.off('click').on('click'
        $variation_form.on('click', '.swatches-select > .nt-swatch:not(.is-selected):not(.nt_unavailable)', function(e) {
           //console.log('click swatch')
           e.preventDefault();
           e.stopImmediatePropagation();
           //index_click++;

           var $this = $(this),
              value = $this.data('value'),
              CurrentSwatch = $this.closest('.swatch'),
              opname = CurrentSwatch.data('opname'),
              id = $this.parent().data('id'),
              $IdSelect = $(IdSelect),
              prev_val,
              //prev_val = (!index_click) ? 19041994 : $IdSelect.val(),
              click_human = (e.originalEvent !== undefined) ? true :false;

           $this.parent().find('.is-selected').removeClass('is-selected');
           $this.parent().find('.is-selected-nt').removeClass('is-selected-nt');
           $this.addClass('is-selected');

           CurrentSwatch.find('.nt_name_current').addClass('user_choose_js').html($this.data('escape')).css("color", "");
           $('.nt_lt_fake.opended').removeClass('opended');

           if ( $(callBackVariant+' .variations .nt-swatch.is-selected').length < size_ops ) return;
           index_click++;
           prev_val = (!index_click) ? 19041994 : $IdSelect.val();

           $variation_form.find('.js_frm_cart').removeClass("disabled").removeAttr('disabled');
           geckoShopify.HideNotices();

           switch (size_ops) {
              case 2:
                 var escape0 = $(NtId +'0 .is-selected').data('escape'),
                     escape1 = $(NtId +'1 .is-selected').data('escape'),
                     variant = getVariantFromOptions(variants,escape0,escape1,null);
                 $IdSelect.val(variant.id);

//                 var index = $(NtId + '0 .is-selected').data('index');
//                 // console.log('index '+index);
//                 if (typeof index === 'undefined') return;

                 if (ck_so_un) {
                       var availableOptions = getVariantFromSize(1,remove_soldout,variants,escape0),
                         getval = $IdSelect.val(),
                         i, l = availableOptions.length;
                     
                       // check Unavailable
                       if (getval === null || getval === "") {
                         
                         // console.log(availableOptions);
                         $(NtId +'1 .is-selected, '+ NtId +'2 .is-selected').removeClass('is-selected');
                         $(NtId +'1 .nt-swatch').eq(ArrOP2.indexOf(availableOptions[0].option2)).addClass('is-selected');
                         escape1 = $(NtId + '1 .is-selected').data('escape');

                         variant = getVariantFromOptions(variants,escape0,escape1,null);
                         $IdSelect.val(variant.id);

                       } // endcheck Unavailable
                   
                       if (ntsoldout && !remove_soldout) {
                         $(NtId +'1 .nt-swatch').addClass('nt_unavailable nt_soldout');
                       } else {
                         $(NtId +'1 .nt-swatch').addClass('nt_unavailable');
                       }

                       for (i = 0; i < l; i++) {
                         var ntvariant = availableOptions[i];
                         //console.log(variant);
                         if (ntsoldout && !remove_soldout && ntvariant.available) {
                           $(NtId +'1 .nt-swatch').eq(ArrOP2.indexOf(ntvariant.option2)).removeClass('nt_soldout nt_unavailable');
                         } else {
                           $(NtId +'1 .nt-swatch').eq(ArrOP2.indexOf(ntvariant.option2)).removeClass('nt_unavailable');
                         }
                       }
                 }// end ckSize

                 break;

              case 3:
                 var escape0 = $(NtId +'0 .is-selected').data('escape'),
                     escape1 = $(NtId +'1 .is-selected').data('escape'),
                     escape2 = $(NtId +'2 .is-selected').data('escape'),
                     variant = getVariantFromOptions(variants,escape0,escape1,escape2);
                      
                 $IdSelect.val(variant.id);
//                    var index = $(NtId + '0 .is-selected').data('index');
//                 if (typeof index === 'undefined') return;

                   if (ck_so_un) {
                     var availableOptions = getVariantFromSize(1,remove_soldout,variants,escape0),
                         availableOptions2 = getVariantFromSize(2,remove_soldout,variants,escape0,escape1),
                         getval = $IdSelect.val(),
                         i, l = availableOptions.length,
                         i2, l2 = availableOptions2.length;
                     
                     //console.log(availableOptions);
                     //console.log(availableOptions2);
                     //console.log(product);
                     //console.log(ArrOP2);
                     //console.log(ArrOP3);
                         
                     // check Unavailable
                     if (getval === null || getval === "") {
                       // console.log(availableOptions);
                       // console.log(availableOptions2);
                       if (l2 > 0 ) {
                         
                         //console.log('l2');
                         $(NtId +'2 .nt-swatch').removeClass('is-selected');
                         $(NtId +'2 .nt-swatch').eq(ArrOP3.indexOf(availableOptions2[0].option3)).addClass('is-selected');
                         escape2 = $(NtId +'2 .is-selected').data('escape');
                         
                       } else { 
                         
                         //console.log('l1');
                         //console.log(availableOptions[0]);
                         
                         $(NtId +'1 .is-selected, '+ NtId +'2 .is-selected').removeClass('is-selected');
                         $(NtId +'1 .nt-swatch').eq(ArrOP2.indexOf(availableOptions[0].option2)).addClass('is-selected');
                         $(NtId +'2 .nt-swatch').eq(ArrOP3.indexOf(availableOptions[0].option3)).addClass('is-selected');
                         escape1 = $(NtId +'1 .is-selected').data('escape');
                         escape2 = $(NtId +'2 .is-selected').data('escape');
                         availableOptions2 = getVariantFromSize(2,remove_soldout,variants,escape0,escape1),
                         l2 = availableOptions2.length;
                         
                       }
                       
                       variant = getVariantFromOptions(variants,escape0,escape1,escape2);
                       $IdSelect.val(variant.id);
                       
                     } // endcheck Unavailable


                     if (ntsoldout && !remove_soldout) {
                       $(NtId +'1 .nt-swatch, '+ NtId +'2 .nt-swatch').addClass('nt_unavailable nt_soldout');
                     } else {
                       $(NtId +'1 .nt-swatch, '+ NtId +'2 .nt-swatch').addClass('nt_unavailable');
                     }

                     for (i = 0; i < l; i++) {
                       var ntvariant = availableOptions[i];
                       //console.log(variant);
                       if (ntsoldout && !remove_soldout && ntvariant.available) {
                         $(NtId +'1 .nt-swatch').eq(ArrOP2.indexOf(ntvariant.option2)).removeClass('nt_soldout nt_unavailable');
                       } else {
                         $(NtId +'1 .nt-swatch').eq(ArrOP2.indexOf(ntvariant.option2)).removeClass('nt_unavailable');
                       }
                     }

                     for (i2 = 0; i2 < l2; i2++) {
                       var ntvariant = availableOptions2[i2];
                       //console.log(variant);
                       if (ntsoldout && !remove_soldout && ntvariant.available) {
                         $(NtId +'2 .nt-swatch').eq(ArrOP3.indexOf(ntvariant.option3)).removeClass('nt_soldout nt_unavailable');
                       } else {
                         $(NtId +'2 .nt-swatch').eq(ArrOP3.indexOf(ntvariant.option3)).removeClass('nt_unavailable');
                       }
                     }
                   }
               // end ckSize
                 break;

              default:
                 var escape0 = $(NtId + '0 .is-selected').data('escape'),
                     variant = getVariantFromOptions(variants,escape0,null,null);
                 $IdSelect.val(variant.id);
           }
           // End switch case

            // update media id
            if (variant.featured_media) {
              mdid = variant.featured_media.id;
            }
           
           // Update group variant img
             updateGroupVariant(selector,opname,value,prefix);

           // Change with variant current
           if (prev_val == $IdSelect.val()) return;
           selectCallback(variant, selector, IdSelect, size_ops, callBackVariant, NtId, prefix, pr_id, click_human, pr_incoming_mess,use_notify_me,save_js,enableHistoryState);
        });
        
         // Click p-nav thumb
         if (!use_clicking_vimg) return;

         $(NtId + '0 .nt-swatch').each(function( index ) {
           ArrOP1.push($(this).data('escape')+'');
         });

         // if (prefix == '_ppr') {
         //   var $carouselMain = $('.p-thumb.flickity-enabled');
         // } else if (prefix == '_qv') {
         //   var $carouselMain = $('.nt_carousel_qv.flickity-enabled');
         // } else if (prefix == '_qs') {
         //   var $carouselMain = $('.nt_carousel_qs.flickity-enabled');
         // } else {
         //   //var prid = $this.closest('.featured_product_se').data('id');
         //   //console.log('prid',prefix, prefix);
         //   var $carouselMain = $('.p-thumb'+prefix+'.flickity-enabled');
         // }
         var $carouselMain = $('.p-thumb'+prefix+'.flickity-enabled');
         
         if ($carouselMain.length == 0) return;

      $carouselMain.on( 'select.flickity', function( event, index ) {
        //console.log('select.flickity')
        if ($(callBackVariant+' .variations .nt-swatch.is-selected').length < size_ops) return;
        var current_mid = $carouselMain.find('.flickity-slider .js-sl-item').eq( index ).data('mdid');

        if ( mdid == current_mid || Arr_MD.indexOf(current_mid) < 0 ) return;
        //console.log(Arr_MD);
          mdid = current_mid;
            //console.log(mdid);

            if (remove_soldout) {

              var arr_curent_var = $.grep( variants, function( v, i ) {
                if (v.featured_media == null) return;
                return v.featured_media.id===mdid && v.available 
              });

            } else {

              var arr_curent_var = $.grep( variants, function( v, i ) {
                if (v.featured_media == null) return;
                return v.featured_media.id===mdid
              });

            }
            //console.log(arr_curent_var);
       
          if ( arr_curent_var.length == 0 ) return;
            var v = arr_curent_var[0];
            //console.log(v);

            if (size_ops == 3) {
               $(NtId + '0 .is-selected, '+ NtId + '1 .is-selected, '+ NtId + '2 .is-selected').removeClass('is-selected');
               $(NtId + '0 .nt-swatch').eq(ArrOP1.indexOf(v.option1)).addClass('is-selected');
               $(NtId + '1 .nt-swatch').eq(ArrOP2.indexOf(v.option2)).addClass('is-selected');
               //$(NtId + '2 .nt-swatch').eq(ArrOP3.indexOf(v.option3)).removeClass('nt_unavailable nt_soldout').click();
               $(NtId + '2 .nt-swatch').eq(ArrOP3.indexOf(v.option3)).removeClass('nt_unavailable').click();

            } else if (size_ops == 2) {
               $(NtId + '0 .is-selected, '+ NtId + '1 .is-selected').removeClass('is-selected');
               $(NtId + '0 .nt-swatch').eq(ArrOP1.indexOf(v.option1)).addClass('is-selected');
               //$(NtId + '1 .nt-swatch').eq(ArrOP2.indexOf(v.option2)).removeClass('nt_unavailable nt_soldout').click();
               $(NtId + '1 .nt-swatch').eq(ArrOP2.indexOf(v.option2)).removeClass('nt_unavailable').click();

            } else {
              $(NtId + '0 .is-selected').removeClass('is-selected');
               //$(NtId + '0 .nt-swatch').eq(ArrOP1.indexOf(v.option1)).removeClass('nt_unavailable nt_soldout').click();
               $(NtId + '0 .nt-swatch').eq(ArrOP1.indexOf(v.option1)).removeClass('nt_unavailable').click();
            }
      });

        // $('.p-nav').on('click', '.n-item', function(e) {

        //  var mdid = $(this).data('mdid');
            
       //      if (remove_soldout) {

       //        var arr_curent_var = $.grep( variants, function( v, i ) {
       //          if (v.featured_media == null) return;
       //          return v.featured_media.id===mdid && v.available 
       //        });

       //      } else {

       //        var arr_curent_var = $.grep( variants, function( v, i ) {
       //          if (v.featured_media == null) return;
       //          return v.featured_media.id===mdid
       //        });

       //      }
       //      //console.log(arr_curent_var);
       
       //    if ( arr_curent_var.length == 0 ) return;
       //      var v = arr_curent_var[0];
       //      //console.log(v);

       //      if (size_ops == 3) {
       //         $(NtId + '0 .is-selected, '+ NtId + '1 .is-selected, '+ NtId + '2 .is-selected').removeClass('is-selected');
       //         $(NtId + '0 .nt-swatch').eq(ArrOP1.indexOf(v.option1)).addClass('is-selected');
       //         $(NtId + '1 .nt-swatch').eq(ArrOP2.indexOf(v.option2)).addClass('is-selected');
       //         $(NtId + '2 .nt-swatch').eq(ArrOP3.indexOf(v.option3)).removeClass('nt_unavailable nt_soldout').click();

       //      } else if (size_ops == 2) {
       //         $(NtId + '0 .is-selected, '+ NtId + '1 .is-selected').removeClass('is-selected');
       //         $(NtId + '0 .nt-swatch').eq(ArrOP1.indexOf(v.option1)).addClass('is-selected');
       //         $(NtId + '1 .nt-swatch').eq(ArrOP2.indexOf(v.option2)).removeClass('nt_unavailable nt_soldout').click();

       //      } else {
       //       $(NtId + '0 .is-selected').removeClass('is-selected');
       //         $(NtId + '0 .nt-swatch').eq(ArrOP1.indexOf(v.option1)).removeClass('nt_unavailable nt_soldout').click();
       //      }
        // });
    };
    // end function Ntproduct_switch
 
    function updateGroupVariant(selector,opname,value,prefix) { 

      if (!use_vimg || selector == '#cart-form_qs') return;
      
      //console.log('selector: '+selector);
      // if (selector == '#cart-form_ppr') {
      //  var parent = '.sp-single .p-thumb';
      // } else if (selector == '#cart-form_qv') {
      //  var parent = '#content_quickview';
      // } else {
      //  var parent = '[data-featured-product-se][data-id="'+prefix+'"] .p-thumb';
      // }
      //  else {
      //  var parent = '.wrap_qs_pr';
      // }
      var parent = '[data-featured-product-se][data-id="'+prefix+'"] .p-thumb';
      if (prefix == '_qv') {
        parent = parent+'_qv'
      }
      //console.log(parent)

      if ( $(parent+' [data-grname="not4"]').length == $(parent+" [data-grname]").length || $(parent+' [data-grname="'+opname+'"]').length == 0  ) return;
         ck_pr_is_ungroup = false;
        //console.log(value);
        // $(parent+' .js-sl-item').addClass('is_varhide');
        // $(parent+' [data-grname="opnt4"], '+parent+' [data-grname="'+opname+'"][data-grpvl="'+value+'"]').removeClass('is_varhide');
        var parent_pnav = '[data-featured-product-se][data-id="'+prefix+'"] .p-nav';

          $(parent+' .js-sl-item,'+parent_pnav+' .js-sl-item').addClass('is_varhide');
          $(parent+' [data-grname="opnt4"], '+parent+' [data-grname="'+opname+'"][data-grpvl="'+value+'"],'+parent_pnav+' [data-grname="opnt4"],'+parent_pnav+' [data-grname="'+opname+'"][data-grpvl="'+value+'"]').removeClass('is_varhide');


        // $('.p-nav.flickity-enabled').removeClass('p-nav-ready').flickity('destroy');
        // geckoShopify.productImagesThumb();

        if (selector == '#cart-form_ppr' && $('.p-thumb.isotope_ok').length > 0) {

          $('.last_visible').removeClass('last_visible');
          $('.js-sl-item:visible:last').addClass('last_visible');
          $('.p-thumb.isotope_ok').isotope();
        
        // } else if (selector == '#cart-form_qv') {

        //    $(parent +' .nt_carousel_qv.flickity-enabled').flickity('deactivate').flickity('activate'); 

        } else {
           
          var flkty = JSON.parse($(parent+'.flickity-enabled').attr('data-flickity') || '{}'),
              flkty2 = JSON.parse($(parent_pnav+'.flickity-enabled').attr('data-flickityjs') || '{}'); 
           
           $(parent+'.flickity-enabled').flickity('destroy').flickity(flkty); 
           $(parent_pnav+'.flickity-enabled').flickity('destroy').flickity(flkty2).removeClass('p-nav-ready');
           setTimeout(function(){ 
            $(parent+'.flickity-enabled').flickity( 'select', 0, false, true); 
            $(parent_pnav).addClass('p-nav-ready');
           }, 50);
           // setTimeout(function(){ 
           //  $(parent_pnav).addClass('p-nav-ready');
           // }, 250);

        } 
        // else {
        //    // Case quick shop #cart-form_qs
        // }
        //geckoShopify.productImagesThumb(prefix);
    };

    var will_not_ship = nt_settings.will_not_ship,
        will_stock_after = nt_settings.will_stock_after;
    function selectCallback(variant, selector, IdSelect, size, callBackVariant, NtId, prefix, pr_id, human,pr_incoming_mess,use_notify_me,save_js,enableHistoryState) {
       //console.log('selector: '+selector)
       var selectorCurent = $(selector),
          IdSelectCurent = $(IdSelect),
          callCurent = $(callBackVariant),
          $qtyElements = '#sp_qty' + prefix,
          outofstock = '#out_stock' + prefix,
          $txt_in = '#txt_vl_in' + prefix,
          $txt_out = '#txt_vl_out' + prefix,
          sku = $('#pr_sku' + prefix),
          sku_na = $('#pr_sku_na' + prefix),
          $nt_stock = $('#nt_stock'+prefix),
          $delivery = $('#delivery'+prefix),
          $nt_countdow = $('#nt_countdow'+prefix+'_txt'),
          addToCart = callBackVariant +' .single_add_to_cart_button',
          $payment_btn = callBackVariant +' .shopify-payment-button',

          $variantQuantity = callCurent.find('.variantQuantity'),
          $productPrice = $(callBackVariant+' .price_varies, #price' + prefix+' .price_varies'),
          $unit_price = $(callBackVariant+' .unit_price, #price' + prefix+' .unit_price'),
          $unit_base = $(callBackVariant+' .unit_base, #price' + prefix+' .unit_base'),
          $frm_notify_pr = $('#frm_notify' + prefix),
          $productsku = $('#productSku' + prefix),
          $input = callCurent.find('.quantity .qty'),
          $addToCart = callCurent.find('.single_add_to_cart_button'),
          $add_text = $addToCart.find('.txt_add'),
          $pre_text = $addToCart.find('.txt_pre'),
          $qty_mess = $('#pr_qty_mess' + prefix),
          $incoming_mess = $('#pr_incoming_mess' + prefix),
          $in_stock = $($txt_in).find('.js_in_stock'),
          $in_stock_preoder = $($txt_in).find('.js_in_stock_pre_oder'),

          sticky_atc_wrap = $('.sticky_atc_wrap'),
          bl_atc_sticky = (selector == '#cart-form_ppr' && $('[data-select-sticky_atc]').length > 0),
          js_sticky_qty = $('.js_sticky_qty'),
          js_sticky_sl = $('.js_sticky_sl'),
          js_fgr_img = $('.js_fgr_img'),
          sticky_atc_price = $('.sticky_atc_price'),
          sticky_atc_js = $('.sticky_atc_js'),
          storeAvailabilityContainer = $('#store_availability'+prefix);

       // addClass style css
       var val_0 = $(NtId + '0 .is-selected').data('value'),
          val_1 = $(NtId + '1 .is-selected').data('value'),
          val_2 = $(NtId + '2 .is-selected').data('value');
       if (size == 2) {
          callCurent.attr('class', 'nt_' + val_0);
          callCurent.addClass('nt1_' + val_1);
       } else if (size == 3) {
          callCurent.attr('class', 'nt_' + val_0);
          callCurent.addClass('nt1_' + val_1);
          callCurent.addClass('nt2_' + val_2);
       }
       // end addClass style css

       $(NtId + '0 .nt_name_current').html(variant.option1);
       $(NtId + '1 .nt_name_current').html(variant.option2);
       $(NtId + '2 .nt_name_current').html(variant.option3);
       if (variant) {
          
          if (variant.available) {
             geckoShopify._updateStoreAvailabilityContent(storeAvailabilityContainer,true,variant.id);
             $($qtyElements+","+addToCart+","+$payment_btn+","+$txt_in).css("display", "inline-block");
             $delivery.css("display", "block");
             $(outofstock+","+$txt_out).css("display", "none");
             $frm_notify_pr.slideUp(250);
             //$qty_mess.hide();
             $incoming_mess.hide();
             
             var qty,ck_qty = false,
                 qty_mess = $nt_stock.data('st'),
                 ck_inventory = $nt_stock.data('qty');
             if ((qty_mess == 1 || qty_mess == 3) && variant.inventory_management && variant.inventory_quantity < ck_inventory && variant.inventory_quantity > 0) {
                //$qty_mess.find('.jsnt').text(variant.inventory_quantity); $qty_mess.show();
                $nt_stock.trigger('cleart');
                geckoShopify.progressbar('#nt_stock'+prefix,variant.inventory_quantity);
                qty = $nt_stock.find('.count').text();
                ck_qty = true;
             } else if (ck_qty && (qty_mess == 2 || qty_mess == 3)) {
                $nt_stock.trigger('cleart');
                geckoShopify.progressbar('#nt_stock'+prefix,qty);
                ck_qty = false;
             }
             $nt_stock.slideDown(250);
             $nt_countdow.slideDown(250);

             if (pr_incoming_mess && variant.inventory_management && variant.inventory_quantity <= 0 && variant.incoming) {
                $incoming_mess.html(will_not_ship); 
                $incoming_mess.find('.jsnt').text(variant.next_incoming_date); 
                $incoming_mess.show();
             }

             // Update quantity.
             // console.log(variant);
             // console.log(variant.inventory_quantity);
             // console.log(variant.inventory_management);
             var ck_pre_order = variant.inventory_quantity <= 0 && variant.inventory_management != null;
             if (ck_pre_order) {
                $add_text.hide(); $pre_text.show();
                $in_stock.hide();$in_stock_preoder.show();
             } else {
                $pre_text.hide(); $add_text.show();
                $in_stock_preoder.hide();$in_stock.show();
             }
             if (ck_pre_order) {
                $input.attr('max', 9999);
                if (bl_atc_sticky) { js_sticky_qty.attr('max', 9999) }
             } else if (variant.inventory_management != null) {
                $input.attr('max', variant.inventory_quantity).val(1).attr('value', 1);
                if (bl_atc_sticky) { js_sticky_qty.attr('max', variant.inventory_quantity).val(1).attr('value', 1) }
             } else {
                $input.attr('max', 9999);
                if (bl_atc_sticky) { js_sticky_qty.attr('max', 9999) }
             }
             // update sticky addtocart
             if (bl_atc_sticky) {
               updateSticky_atc(variant,sticky_atc_js,js_sticky_sl,js_fgr_img,sticky_atc_price);
             }

          } else {
             geckoShopify._updateStoreAvailabilityContent(storeAvailabilityContainer,false);
             $nt_stock.slideUp(250);
             $nt_countdow.slideUp(250);
             $delivery.css("display", "none");
             $($qtyElements+","+addToCart+","+$payment_btn+","+$txt_in).css("display", "none");
             $(outofstock+","+$txt_out).css("display", "inline-block");

             $incoming_mess.hide();
             if (pr_incoming_mess && variant.inventory_management && variant.inventory_quantity <= 0 && variant.incoming) {
                $incoming_mess.html(will_stock_after); 
                $incoming_mess.find('.jsnt').text(variant.next_incoming_date); $incoming_mess.show();
             }

             // notify me
             if (use_notify_me) {
                $frm_notify_pr.slideDown(350);
                var text = $frm_notify_pr.find('textarea').text();
                $frm_notify_pr.find('textarea').text(text.replace('[variant]', variant.title).replace('[url]', '?variant=' + variant.id));
             }
          }
          // end check variant.available

          // Update price display.
          var customPrice = geckoShopify.formatMoney(variant.price),
              _onsale = $('#product'+prefix.replace('_ppr','').replace('_','')+'-' + pr_id + ' .onsale');

          if (variant.compare_at_price > variant.price) {
             var comparePrice = geckoShopify.formatMoney(variant.compare_at_price);
             var customPriceFormat = '<del>' + comparePrice + '</del> <ins>' + customPrice + '</ins>';
                customPriceFormat += ' <span class="onsale fs__14 tu dib cw pr_onsale hide"><span></span></span>';
             $productPrice.html(customPriceFormat);

             var save = ((variant.compare_at_price - variant.price) * 100) / variant.compare_at_price;

             _onsale.find('>span').html(save_js.replace('[sale]', Math.ceil(save)));
             _onsale.show();
          } else {
             $productPrice.html(customPrice);
             _onsale.hide();
          }

          // Unit price
          if (variant.unit_price) {
           //console.log('Unit price');
           $unit_price.html(geckoShopify.formatMoney(variant.unit_price));
           $unit_base.html(getBaseUnit(variant));
          }
          
          // Update currency 
          body.trigger('refresh_currency');

          // Update sku
          if (variant.sku) {
             sku_na.css("display", "none");
             sku.text(variant.sku).css("display", "inline-block");
          } else {
             sku.css("display", "none");
             sku_na.css("display", "inline-block");
          }
          
          // Update variant img
          if (variant.featured_media && !ntla_ck) {
             // console.log(variant.featured_image.id)
             var id = variant.featured_media.id, $img = $('.p-thumb [data-mdid="'+id+'"]').first();
             //console.log(id);
             
             if ($img.length == 1 && selector == '#cart-form_ppr' && $('.p-thumb.isotope_ok').length > 0 ) {
                if (ck_pr_is_ungroup) {
                  updateImageVariantPositionIsotope($img);  
                }
             } else {
                updateImageVariantPositionSlider(selector,id,human,prefix);
             }
          }
          //ntla_ck = false;
          if (human || ntla_ck) {ntla_ck = false;}
          
          // Update historyState
          if (enableHistoryState && selector == '#cart-form_ppr') {
             _updateHistoryState(variant)
          }
         
       }
    };

     /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
     function getCurrentOptions(val1,val2,val3) {
         
     };

     function getVariantFromSize(size,bl,variants,vl0,vl1,vl2) {
       if ( size == 0 ) {
         
         var found = $.grep( variants, function( v, i ) {
           return v.available == false;
         });
         
       } else if ( size == 2 & bl ) {
         
         var found = $.grep( variants, function( v, i ) {
           return v.option1 == vl0 && v.option2 == vl1 && v.available;
         });
         
       } else if (bl) {
         
         var found = $.grep( variants, function( v, i ) {
           return v.option1 == vl0 && v.available;
         });
         
         
       } else if ( size == 2 ) {
         
         var found = $.grep( variants, function( v, i ) {
           return v.option1 == vl0 && v.option2 == vl1;
         });
         
       } else {
         
         var found = $.grep( variants, function( v, i ) {
           return v.option1 == vl0;
         });
       
       }
       
      return found || 'nathan';

     };
  
    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
     function getVariantFromOptions(variants,vl0,vl1,vl2) {
      
      var found = $.grep( variants, function( v, i ) {
        //return v.option1 === vl0 && v.option2 === vl1 && v.option3 === vl2 ;
        return v.option1 == vl0 && v.option2 == vl1 && v.option3 == vl2 ;
      });
      return found[0] || 'nathan';

     };

      function getBaseUnit(variant) {
        return variant.unit_price_measurement.reference_value === 1
          ? variant.unit_price_measurement.reference_unit
          : variant.unit_price_measurement.reference_value +
              variant.unit_price_measurement.reference_unit;
      };

     /**
     * Update history state for product deeplinking
     *
     * @param  {variant} variant - Currently selected variant
     * @return {k}         [description]
     */
    function _updateHistoryState(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        '?variant=' +
        variant.id;
      window.history.replaceState({ path: newurl }, '', newurl);
    };
    
    function StoreAvailability(selector,variantId) {
      
      var this_0 = selector[0],
          hidden = 'hide';
      function updateContent() {
        var store_avai_length = $('.store_availabilities_modal.act_opened').length,
            variantSectionUrl = this_0.dataset.baseUrl +'/variants/' +variantId +'/?section_id=store-availability',
            hasOnlyDefaultVariant = this_0.dataset.hasOnlyDefaultVariant === 'true';

        selector.find('.push_side.act_current').trigger('click');
        this_0.style.opacity = 0.5;

        fetch(variantSectionUrl).then(function(response) {
            return response.text();
          }).then(function(storeAvailabilityHTML) {
            if (storeAvailabilityHTML.trim() === '') {
              return;
            }
            selector.slideUp(10);
            this_0.innerHTML = storeAvailabilityHTML;
            this_0.innerHTML = this_0.firstElementChild.innerHTML;
            this_0.style.opacity = 1;
            selector.slideDown(350);

            _updateProductTitle();
            if (hasOnlyDefaultVariant) {
              _hideVariantTitle();
            }
            if (store_avai_length > 0) {
              setTimeout(function(){ selector.find('.push_side').trigger('click'); }, 250);
            }

          });
      }
      
      function clearContent() {
        this_0.innerHTML = '';
      }
      
      function _updateProductTitle() {
        selector.find('[data-store-availability-modal-product-title]').text(this_0.dataset.productTitle);
      }
      
      function _hideVariantTitle() {
         selector.find('[data-store-availability-modal-variant-title]').addClass(hidden);
      }

      return {
        updateContent: updateContent,
        clearContent: clearContent
      };

    };

    geckoShopify._updateStoreAvailabilityContent = function (selector,bl,variantId) {
      //console.log(selector,variantId)
      if (selector.length == 0) return;

      if (bl) {
        StoreAvailability(selector,variantId).updateContent();
      } else {
        StoreAvailability(selector).clearContent();
      }
    };

    function updateImageVariantPositionIsotope($img) {
        var live_stuck_h = $('.ntheader.live_stuck .sp_header_mid').outerHeight() || 0;
      if ( !geckoShopify.isVisible($img)) {
       $('html, body').animate({
          scrollTop: $img.offset().top - live_stuck_h - 30
       }, 250); 
      }
      $('.p-thumb.isotope_ok').one( 'arrangeComplete', function() {
        if ( !geckoShopify.isVisible($img)) {
         $('html, body').animate({
            scrollTop: $img.offset().top - live_stuck_h - 30
         }, 80);
        }
      });
    };

    function updateImageVariantPositionSlider(selector,id,human,prefix) {
      //console.log(human);
      var parent = '.p-thumb'+prefix;

      if (selector == '#cart-form_ppr') {
        parent = '.p-thumb'
      } else if (selector == '#cart-form_qv') {
        parent = '.nt_carousel_qv'
      } else if (selector == '#cart-form_qs') {
        parent = '.nt_carousel_qs'
      }
      if (parent.length < 1) return;
      
      $(parent+'.flickity-enabled').flickity( 'selectCell', '[data-mdid="'+id+'"]', false, human );
      //$(parent+'.flickity-enabled').off( 'select.flickity', listener_pr).flickity( 'select', index, false, true ).on( 'select.flickity', listener_pr);
      
    };

    function updateSticky_atc(variant,sticky_atc_js,js_sticky_sl,js_fgr_img,sticky_atc_price) {

        sticky_atc_js.removeClass("disabled");
        // update variant name
        js_sticky_sl.val(variant.id);

        var op_cked = js_sticky_sl.find('option:checked'),
          ogprice = op_cked.data('ogprice'),
          price = op_cked.data('price'),
          img = op_cked.data('img');

        $('.sticky_atc_a').html(op_cked.text());
        // update variant img
        js_fgr_img.attr('src',img.replace('1x1','75x')).attr('srcset',img.replace('1x1','75x')+' 75w,'+img.replace('1x1','150x')+' 150w');
        // update variant price
        if ( ogprice > price ) {
           sticky_atc_price.html('<del>'+geckoShopify.formatMoney(ogprice)+'</del> <ins>'+geckoShopify.formatMoney(price)+'</ins>');
        } else {
           sticky_atc_price.html(geckoShopify.formatMoney(price));
        }
        body.trigger('refresh_currency');

        if (variant.inventory_quantity <= 0 && variant.available && variant.inventory_management != null) {
            $('.sticky_atc_js .txt_add').hide(); $('.sticky_atc_js .txt_pre').show();
        } else {
            $('.sticky_atc_js .txt_pre').hide(); $('.sticky_atc_js .txt_add').show();
        }
      
    };
      
    geckoShopify.NtproductPage = function (pr_id) {
      // Stop parsing if we don't have the product json script tag when loading
      // section in the Theme Editor
      if (!$('#ProductJson-template'+pr_id).html()) {
        return;
      }

        var productJson = JSON.parse($('#ProductJson-template'+pr_id).html()),
          incomingJson = JSON.parse($('#ProductJson-incoming'+pr_id).html()),
          IdSelect = '#product-select'+pr_id,NtId = '#nt_select'+pr_id+'_',selector = '#cart-form'+pr_id,callBackVariant = '#callBackVariant'+pr_id,prefix=''+pr_id,
          i,variant,Arr_MD = [];

          productJson.ck_so_un = incomingJson.ck_so_un; 
          productJson.ntsoldout = incomingJson.ntsoldout; 
          productJson.unvariants = incomingJson.unvariants;
          productJson.remove_soldout = incomingJson.remove_soldout;
          productJson.size_avai = incomingJson.size_avai;
          productJson.tt_size_avai = incomingJson.tt_size_avai;
          
      for (i in incomingJson.variants) {
        variant = incomingJson.variants[i];
        productJson.variants[i].incoming = variant.incoming;
        productJson.variants[i].next_incoming_date = variant.next_incoming_date;
        productJson.variants[i].inventory_quantity = variant.inventory_quantity;
        Arr_MD.push(variant.mdid);
      }
      //console.log(product);

         geckoShopify.Ntproduct_switch('.variations_form'+pr_id,Arr_MD,productJson,selector,IdSelect,NtId,callBackVariant,prefix);
         if (nt_settings.pr_curent !== "1" || $('#cart-form_ppr .is-selected-nt').length>0) {
             $('#nt_select'+pr_id+'_1 .is-selected-nt, #nt_select'+pr_id+'_2 .is-selected-nt').addClass('is-selected').removeClass('is-selected-nt');
             $('#nt_select'+pr_id+'_0 .is-selected-nt').click().removeClass('is-selected-nt');
             
              if (!use_vimg) return;
              $('#nt_select'+pr_id+'_1 .is-selected,#nt_select'+pr_id+'_2 .is-selected').removeClass('is-selected').click();
         }
    };
    
    // fuction add to cart
    geckoShopify.ajaxAddItem = function() {

      body.on('click', '.js_addtc', function(e) {
        e.preventDefault();
      
        var _this = $(this),
            vid = _this.data('id'),
            qty = parseInt($(_this).prev().find('.qty_pr_js').val()) || _this.data('qty') || 1,
            arr_items= [];
           arr_items.push({
              id: vid,
              quantity: qty
           });

           _this.addClass('loading');
           $ld.trigger( "ld_bar_star" );

           addItem(arr_items);
      });
      
      $('.sticky_atc_js').on('click', function (e) {
        e.preventDefault();
        
        if ($(this).hasClass('disabled')) {
          geckoShopify.CreatNotices(PleaseChoosePrOptions);
          $('#callBackVariant_ppr .nt_name_current:not(.user_choose_js)').css("color", "#ec0101");
          $('.sticky_atc_a').trigger('click')
          return false;
        }
        //geckoShopify.HideNotices();

        var _this = $(this),
            vid = parseInt($('.js_sticky_sl').val()),
            qty = parseInt($('.js_sticky_qty').val()) || 1,
            arr_items= [];
            //console.log(qty);
           arr_items.push({
              id: vid,
              quantity: qty
           });

           _this.addClass('loading');
           $ld.trigger( "ld_bar_star" );

           addItem(arr_items);
      });

      body.on('click', '.js_frm_cart', function(e) {
        e.preventDefault();

        var _this = $(this),
           frmId = _this.closest('form');

        if (_this.hasClass('disabled')) {
          geckoShopify.CreatNotices(PleaseChoosePrOptions);
          frmId.find('.nt_name_current:not(.user_choose_js)').css("color", "#ec0101");
          return false;
        }
        //geckoShopify.HideNotices();

         _this.addClass('loading');
         $ld.trigger( "ld_bar_star" );
         addItemFrom(frmId);
      });

      body.on('click', '.js_add_group', function(e) {
        e.preventDefault();

        var _this = $(this),
           frmId = _this.closest('form');

           _this.addClass('loading');
           $ld.trigger( "ld_bar_star" );
           addItemFrom(frmId);
      });

      // body.on('click', '.js_add_group', function(e) {
      //   e.preventDefault();

      //   var _this = $(this),
      //      wrap = _this.closest('.js_wrap_group'),
      //      check = true,
      //      arr_items= [];

      //      _this.addClass('loading');
      //      $ld.trigger( "ld_bar_star" );
                 
      //    wrap.find('.js_item_group').each(function () {
      //       var a = $(this),
      //          id = a.find('.js_grp_vid').val(),
      //          qty = a.find('.js_grp_qty').val();
      //       //console.log(qty);
      //       if (qty > 0 && id !== '') {
      //          check = false;
      //          arr_items.push({
      //             id: id,
      //             quantity: qty
      //          });
      //       }
      //    });

      //    //console.log(arr_items);
      //    if (check) return;
      //    addItem(arr_items);

      // });

    };

    // Sticky add to cart
     geckoShopify.stickyAddToCart = function() {
      var $trigger = $('.entry-summary .variations_form');
      var $stickyBtn = $('.sticky_atc_wrap');

      if ($stickyBtn.length <= 0 || $trigger.length <= 0 || (window_w < 768 && $stickyBtn.hasClass('mobile_false'))) return;

      var summaryOffset = $trigger.offset().top + $trigger.outerHeight(),
          $selector = $('.sticky_atc_wrap, #nt_backtop'),
          slpr_wrap = $('.popup_slpr_wrap'),
          $window = $(window),
          $document = $(document);
          // ,_footer = $('#nt_footer'),
          // off_footer = 0,
          // ck_footer = _footer.length > 0;

      var stickyAddToCartToggle = function () {
        var windowScroll = $window.scrollTop(),
            windowHeight = $window.height(),
            documentHeight = $document.height(),
            totalScroll = parseInt(windowScroll + windowHeight) + 60;
        // if (ck_footer) {
        //   off_footer = _footer.offset().top - _footer.height();
        // } else {
        //   off_footer = windowScroll;
        // }
           // console.log(ck_footer);
           // console.log(off_footer);

           // console.log(windowScroll); 
        // if (windowScroll + windowHeight == documentHeight || summaryOffset > windowScroll || windowScroll > off_footer ) {
        //   $selector.removeClass('sticky_atc_shown');
        //   slpr_wrap.removeClass('sticky_atc_shown');
        // } else if (summaryOffset < windowScroll && windowScroll + windowHeight != documentHeight) {
        //   $selector.addClass('sticky_atc_shown');
        //   slpr_wrap.addClass('sticky_atc_shown');
        // }
//         console.log(`${summaryOffset} < ${windowScroll} && ${totalScroll} !== ${documentHeight} && ${totalScroll} < ${documentHeight}`)
//         console.log(`${totalScroll} === ${documentHeight} || ${totalScroll} > ${documentHeight} || ${summaryOffset} > ${windowScroll}`)
        if (summaryOffset < windowScroll && totalScroll !== documentHeight && totalScroll < documentHeight) {
          //console.log('1'); 
          $selector.addClass('sticky_atc_shown');
          slpr_wrap.addClass('sticky_atc_shown');
       
        } else if (totalScroll === documentHeight || totalScroll > documentHeight || summaryOffset > windowScroll) {
          // scroll last footer show windowScroll + windowHeight == documentHeight || summaryOffset > windowScroll 
          //console.log('2'); 
          $selector.removeClass('sticky_atc_shown');
          slpr_wrap.removeClass('sticky_atc_shown');
        }
      };

      stickyAddToCartToggle();

      $window.scroll(stickyAddToCartToggle);

      $('.sticky_atc_a').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
          scrollTop: $('.entry-summary').offset().top
        }, 800);
      });

      // Quantity.
      $('.sticky_atc_wrap .qty').on('change', function(){
        $('#sp_qty_ppr .qty').val($(this).val())
        //.trigger('change');
      });

      $('#sp_qty_ppr .qty').on('change', function(){
        $('.sticky_atc_wrap .qty').val($(this).val());
      });
    };

    // product group
    geckoShopify.ajaxfgr = function() {
      if ($('.js_grp_vid').length == 0) return;
      
      $('.js_grp_vid').change(function(e) {
        var _this = $(this),
        sl = _this.closest('.js_item_group'),
        op_cked = _this.find('option:checked'),
       ogprice = op_cked.data('ogprice'),
         price = op_cked.data('price'),
         qty = op_cked.data('qty'),
         $qty = sl.find('.js_grp_qty'),
         img = op_cked.data('img'),
         img_url = '115x';

         sl.find('img').attr('src',img.replace('1x1',img_url)).attr('srcset',img.replace('1x1',img_url)+' 1x,'+img.replace('1x1',img_url+'@2x')+' 2x');
        if ( ogprice > price ) {
            sl.find('.js_price_group').attr('data-ogprice',ogprice).attr('data-price',price).html('<del>'+geckoShopify.formatMoney(ogprice)+'</del> <ins>'+geckoShopify.formatMoney(price)+'</ins>');
        } else {
            sl.find('.js_price_group').attr('data-ogprice',ogprice).attr('data-price',price).html(geckoShopify.formatMoney(price));
        }

        $qty.attr('max', qty);
        if ( qty < $qty.val() ) {
             $qty.val(qty);
        }

       var fgr_frm = _this.closest('.fgr_frm');
        if (fgr_frm.length < 1) return;

        subtt_price_group(fgr_frm);
        body.trigger('refresh_currency');

      });

    };

    //update subtotal price
   function subtt_price_group(fgr_frm) {
         var js_item_group = fgr_frm.find('.js_item_group.item_group_true'),
         grp_subtt_js = fgr_frm.find('.grp_subtt_js'),
         js_add_group = fgr_frm.find('.js_add_group'),
         total_price = 0,total_ogprice = 0;
        //console.log(js_item_group)
        js_item_group.each(function () {
          var _this = $(this),
             qty = _this.find('.qty_pr_js').val(),
             _price = _this.find('.js_price_group'),
             price = _price.attr('data-price'),
             ogprice = _price.attr('data-ogprice') || price;
            total_price = total_price + (qty*price);
            total_ogprice = total_ogprice + (qty*ogprice);
        });
        
        if ( total_ogprice > total_price ) {
            grp_subtt_js.html('<del>'+geckoShopify.formatMoney(total_ogprice)+'</del> <ins>'+geckoShopify.formatMoney(total_price)+'</ins>');
        } else {
            grp_subtt_js.html(geckoShopify.formatMoney(total_price));
        }
        if (total_price > 0){
          js_add_group.removeAttr('disabled');
        } else {
          js_add_group.attr("disabled", true);
        }
    };

    // Frequently bought together
    geckoShopify.ajaxFbt = function() {
     
     if ($('.js_fbt_ck').length == 0) return;
      
      var time,
          clbtn = $('.js_fpt_clbtn'),
          tt_price = $('.kl_fbt_tt_price'),
          ogprice_old,price_old;

      $('.kl_fbt_li>label').click(function(e) {
        
        clearTimeout(time);
       var frm = $(this).closest('.kl_fbt_li'),
           sl = $(frm.data('sl')),
           fbt_input = frm.find('.js_fbt_input'),
            fbt_sl = frm.find('.js_fbt_sl'),
            grp_qty = frm.find('.js_grp_qty');

        time = setTimeout(function(){
        if (frm.find('.js_fbt_ck').is(':checked')) {
             frm.addClass('kl_fbt_checked');
             sl.fadeIn(300);
             fbt_update(fbt_sl,fbt_input,true);
             clbtn.fadeTo(0, 0).fadeTo(300, 1);
             fbt_sl.prop('disabled', false);
             fbt_input.prop('disabled', false);
             grp_qty.prop('disabled', false);
        } else {
             frm.removeClass('kl_fbt_checked');
             sl.fadeOut(300);
             fbt_update(fbt_sl,fbt_input,false);
             fbt_sl.prop('disabled', true);
             fbt_input.prop('disabled', true);
             grp_qty.prop('disabled', true);
             clbtn.fadeOut(300, function() {
           clbtn.fadeIn(300);
          });
        }
        }, 100);

    });

    // $('.js_fbt_sl').click(function(e) {
    //     // Store the current value on focus and on change
    //     var _this = $(this),
    //         op_cked = _this.find('option:checked');
            
    //         //console.log('focus');
    //         ogprice_old = op_cked.data('ogprice');
    //         price_old = op_cked.data('price');

    //    }).change(function(e) {
       
    $('.js_fbt_sl').off('mousedown click').on('mousedown click', function(e){
        // Store the current value on focus and on change
        var _this = $(this),
            op_cked = _this.find('option:checked');
            
            //console.log('focus');
            ogprice_old = op_cked.data('ogprice');
            price_old = op_cked.data('price');

       }).on('change', function(e){
        var _this = $(this),
            fbt_li = _this.closest('.kl_fbt_li'),
            fbt_price = fbt_li.find('.kl_fbt_price'),
            op_cked = _this.find('option:checked'),
            ogprice = op_cked.data('ogprice'),
            price = op_cked.data('price'),
            img = op_cked.data('img'),
            sl = $(fbt_li.data('sl')),
            img_url = '115x';
            
            // change img
            //console.log( img );
            sl.find('img').attr('src',img.replace('1x1',img_url)).attr('srcset',img.replace('1x1',img_url)+' 1x,'+img.replace('1x1',img_url+'@2x')+' 2x');

            // change price
            // console.log( ogprice_old );
            // console.log( price_old );
            // console.log( ogprice );
            // console.log( price );
          
          var a = ogprice_old - ogprice,
              b = price_old - price;

          //if ( a == 0) return;

            // update line item
          if ( ogprice > price ) {
              fbt_price.html('<del>'+geckoShopify.formatMoney(ogprice)+'</del> <ins>'+geckoShopify.formatMoney(price)+'</ins>');
          } else {
              fbt_price.html(geckoShopify.formatMoney(price));
          }
          // update total
          tt_update(a, b,false);
            
     });

    function fbt_update(fbt_sl,fbt_input,bl) {
        if (fbt_sl.length > 0) {
             var op_cked = fbt_sl.find('option:checked'),
                ogprice = op_cked.attr('data-ogprice'),
                price = op_cked.attr('data-price');
                // console.log(op_cked);
                // console.log(price);
             tt_update(ogprice, price,bl);

        } else {
             var ogprice = fbt_input.attr('data-ogprice'),
                price = fbt_input.attr('data-price');
                // console.log(fbt_input);
                // console.log(ogprice);
             tt_update(ogprice, price,bl);
        }
    };

     function tt_update(ogprice, price,bl) {
         
         // console.log(ogprice);
         // console.log(price);
      if (bl) {
        var cppr = parseInt(tt_price.attr('data-cppr')) + parseInt(ogprice);
        var pr = parseInt(tt_price.attr('data-pr')) + parseInt(price);
      } else {
        var cppr = parseInt(tt_price.attr('data-cppr')) - parseInt(ogprice);
        var pr = parseInt(tt_price.attr('data-pr')) - parseInt(price);
      }
         // console.log(cppr);
         // console.log(pr);
      tt_price.attr('data-cppr',cppr);
      tt_price.attr('data-pr',pr);

        if ( cppr > pr ) {
            tt_price.html('<del>'+geckoShopify.formatMoney(cppr)+'</del> <ins>'+geckoShopify.formatMoney(pr)+'</ins>');
        } else {
            tt_price.html(geckoShopify.formatMoney(pr));
        }
        body.trigger('refresh_currency');

     };

    };

    geckoShopify.ajaxchangeItem = function() {

      if ( body.hasClass('min_cqty_1') ) {

        nt_js_cart.on( 'keyup','.qty_cart_js', function( e ) {
            var _this = $(this),
               prev = _this.data('val'),
                qty = _this.val() || 1,
                min = _this.attr('min') || 0;
                //console.log(prev);

              if (parseInt(qty) < parseInt(min)) {
                _this.data('val', $(this).val());
                  _this.val(prev);
              }
        });
      }

      nt_js_cart.on('focusin', '.qty_cart_js', function(){
          $(this).data('val', $(this).val());
         }).on( 'change','.qty_cart_js', function( e ) {
        //e.preventDefault();

          var _this = $(this),
              _item = _this.closest('.js_cart_item'), 
              _frm = _this.closest('form.nt_js_cart'), 
              vid = _this.data('id'),
              //prev = _this.data('val'),
              qty = _this.val() || 1,
              max = _this.attr('max') || 9999;
              //console.log(prev);

          _this.parent().find('.minus').removeClass (function (index, css) {
             return (css.match (/(^|\s)qty_\S+/g) || []).join(' ');
          }).addClass('qty_'+qty);

          //_this.parent().find('.minus').removeClass('qty_'+prev).addClass('qty_'+qty);
            
              geckoShopify.HideNotices(); 
              if (parseInt(qty) > parseInt(max)) { 
                qty = max;_this.val(qty);

                if ( nt_settings.disOnlyStock ) return;
                var txt = $('#js_we_stcl').text() || 'Not enough items available. Only [max] left.'; 
                geckoShopify.CreatNotices(txt.replace('[max]', max));
                return false;
              }

          if (_frm.hasClass('frm_cart_ajax_false')) return;

          //nt_js_cart.addClass('loading');
          nt_js_cart.addClass('ld_nt_cl');
          //$ld_cart.addClass('on_star');
          _item.find('.ld_cart_bar').addClass('on_star');
          //_item.addClass('rm_op')
          changeItem(vid,qty,_item);
      });

      nt_js_cart.on('click', '.js_cart_rem', function(e) {
        if ($(this).closest('form.nt_js_cart').hasClass('frm_cart_ajax_false')) return;
        e.preventDefault();
        //nt_js_cart.addClass('loading');
        var vid = $(this).data('id'), qty = 0,_item = $(this).closest('.js_cart_item');
        nt_js_cart.addClass('ld_nt_cl');
        //$ld_cart.addClass('on_star');
        _item.find('.ld_cart_bar').addClass('on_star');
        //_item.addClass('rm_op')
         changeItem(vid,qty,_item);

      });

      // Save note anytime it's changed
      nt_js_cart.on('change', 'textarea[name="note"]', function() {
        var newNote = $(this).val();

        // Update the cart note in case they don't click update/checkout
        geckoShopify.updateCartNote(newNote);
      });

      if (!geckoShopify.cookiesEnabled()) {
        $('.cookie-message').show();
      }

    };

    function addItem(items, _this) {
      //data: 'quantity=' + qty + '&id=' + vid,

      // Start case js ajax

      // var params = {
      //   type: 'POST',
      //   url: cartAddUrl,
      //   data: {
      //    "items": items
      //   },
      //   dataType: 'json',
      //   success: function(line_item) { 
      //     //console.log(line_item.items[0]);
      //      if ( line_item.items.length == 1) {
      //       var id = line_item.items[0].product_id;
      //      } else {
      //       var id = 19041994;
      //      }
      //     geckoShopify.onCartUpdate(1,1,id);
      //     //_this.removeClass('loading');
      //   },
      //   error: function(XMLHttpRequest, textStatus) {
      //     geckoShopify.onError(XMLHttpRequest, textStatus);
      //   }
      // };
      // $.ajax(params);

      // Start case js fetch
      //console.log(items)
      // var request = {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json;'
      //   },
      //   body: JSON.stringify({
      //     items: items
      //   })
      // };
      var formData = {
       'items': items
      };
      //fetch(cartAddUrl, request)
      fetch(cartAddUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(line_item) {
        if (line_item.status && line_item.status !== 200) {
          var error = new Error(line_item.description);
          error.isFromServer = true;
          throw error;
        }
          //console.log(line_item.status,line_item);
          if (line_item.id == undefined) {
               var id = 19041994;
          } else {
            var id = line_item.items[0].product_id;
          }
          //console.log(line_item)
          miniCartUpsell(line_item.items[0].product_id);
           geckoShopify.onCartUpdate(1,1,id);
            if ( id != '19041994' ) {
              var el = $('.nt_stock_page[data-prid="'+id+'"]'),
                  qty = line_item.quantity;
              geckoShopify.progressbarUpdateATC(el,qty);
            }
            body.trigger('CartUpdateSuccess');
      })
      .catch(function(error) {
        // eslint-disable-next-line no-console
         //console.log('addFetch item error: ',error);
         geckoShopify.onError2(error);
      });
      // End case js fetch

    };

    /*!
     * Serialize all form data into a SearchParams string
     * (c) 2020 Chris Ferdinandi, MIT License, https://gomakethings.com
     * @param  {Node}   form The form to serialize
     * @return {String}      The serialized form data
     */
    function serializet4(form) {
      var arr = [];
      Array.prototype.slice.call(form.elements).forEach(function(field) {
        if (
          !field.name ||
          field.disabled ||
          ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1
        )
          return;
        if (field.type === 'select-multiple') {
          Array.prototype.slice.call(field.options).forEach(function(option) {
            if (!option.selected) return;
            arr.push(
              encodeURIComponent(field.name) +
                '=' +
                encodeURIComponent(option.value)
            );
          });
          return;
        }
        if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked)
          return;
        arr.push(
          encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value)
        );
      });
      return arr.join('&');
    };

    var _cart_upsell = $('[data-cart-upsell-js]'),
        _cart_upsell_length = _cart_upsell.length;
    function miniCartUpsell(id) {
      
      if ( id == 19041994) {
        // id = localStorage.getItem('nt_cartt4id') || _cart_upsell.data('id')
        id = _cart_upsell.data('id')
      }
      //console.log(id.length)
      if (_cart_upsell_length == 0 || id.length == 0) return;

      var limit = _cart_upsell.data('limit'),
         baseUrl = _cart_upsell.data('baseurl'),
         url = baseUrl+'?section_id=mini_cart_upsell&product_id='+id+'&limit='+limit;
        
        fetch(url).then(function(response) {
            return response.text();
          }).then(function(section) {
            //console.log('section',section);
            var recommendationsMarkup = $(section).html();
            if (recommendationsMarkup.trim() === '') {
              return;
            }
            _cart_upsell.html(recommendationsMarkup);
            body.trigger('refresh_currency');
            var _el = _cart_upsell.find('[data-flickity]');
            if (_el.length == 0) return;
            geckoShopify.refresh_flickity(_el);
            setTimeout(function(){ _el.flickity('reloadCells') }, 250);
            setTimeout(function(){ _el.flickity('reloadCells') }, 500);
            //localStorage.setItem('nt_cartt4id', id);

          });
    };

    function addItemFrom(form_id, _this) {
        var clicked_ed_js = $('.cart_ac_edit.clicked_ed_js');
        
        // Start case js ajax
        // var params = {
        //   type: 'POST',
        //   url: cartAddUrl,
        //   data: form_id.serialize(),
        //   dataType: 'json',
        //   success: function(line_item) { 
        //     if (line_item.id == undefined) {
        //          var id = 19041994;
        //     } else {
        //       var id = line_item.product_id;
        //     }
        //     //console.log(line_item)
        //      geckoShopify.onCartUpdate(1,1,id);
        //       if ( id != '19041994' ) {
        //         var el = $('.nt_stock_page[data-prid="'+id+'"]'),
        //             qty = line_item.quantity;
        //         geckoShopify.progressbarUpdateATC(el,qty);
        //       }
        //      //_this.removeClass('loading');
        //   },
        //   error: function(XMLHttpRequest, textStatus) {
        //     geckoShopify.onError(XMLHttpRequest, textStatus);
        //   }
        // };

        // if (clicked_ed_js.length > 0 && edit_item == '0') {

        //   $.ajax({
        //     type: 'POST',
        //     url: cartChangeUrl,
        //     data:  'quantity=0&id='+clicked_ed_js.next().data('id'),
        //     dataType: 'json',
        //     success: function(cart) { 
        //        $('.jsccount').html(cart.item_count);
        //        clicked_ed_js.removeClass('clicked_ed_js');
        //        $.ajax(params);
        //     },
        //     error: function(XMLHttpRequest, textStatus) {
        //       geckoShopify.onError(XMLHttpRequest, textStatus);
        //     }
        //   });

        // } else {
        //   $.ajax(params);
        // }

        // Start case js fetch
        function addFetchFrom(form_id, _this) {
          fetch(cartAddUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: serializet4(form_id[0])
          })
            .then(function(response) {
              return response.json();
            })
            .then(function(line_item) {
              if (line_item.status && line_item.status !== 200) {
                var error = new Error(line_item.description);
                error.isFromServer = true;
                throw error;
              }
                //console.log(line_item.status,line_item);
                if (line_item.id == undefined) {
                     var id = 19041994;
                } else {
                  var id = line_item.product_id;
                }
                //console.log(line_item)
                miniCartUpsell(line_item.product_id);
                 geckoShopify.onCartUpdate(1,1,id);
                  if ( id != '19041994' ) {
                    var el = $('.nt_stock_page[data-prid="'+id+'"]'),
                        qty = line_item.quantity;
                    geckoShopify.progressbarUpdateATC(el,qty);
                  }
                 body.trigger('CartUpdateSuccess');
            })
            .catch(function(error) {
              // eslint-disable-next-line no-console
              //console.log('addFetchFrom error: ',error);
              geckoShopify.onError2(error);
            });
        };

        if (clicked_ed_js.length > 0 && edit_item == '0') {

          var request = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;'
            },
            body: JSON.stringify({
              id: clicked_ed_js.next().data('id'),
              quantity: 0
            })
          };
          
          fetch(cartChangeUrl, request)
          .then(function(response) {
            return response.json();
          })
          .then(function(cart) {
               $('.jsccount').html(cart.item_count);
               clicked_ed_js.removeClass('clicked_ed_js');
              addFetchFrom(form_id, _this);
          })
          .catch(function(error) {
            // eslint-disable-next-line no-console
            console.log('Cart change error: '+error);
          });

        } else {
          addFetchFrom(form_id, _this);
        }
        // End case js fetch

    };

    function changeItem(vid, qty, _item) {
      
      // Start case js ajax

      // var params = {
      //   type: 'POST',
      //   url: cartChangeUrl,
      //   data:  'quantity='+qty+'&id='+vid,
      //   dataType: 'json',
      //   success: function(cart) { 
      //     //console.log(cart)
      //     // if (cart.item_count == 0) {
      //     //  geckoShopify.onCartUpdate(0,1);
      //     // } else if (qty == 0) {
      //     //  geckoShopify.onCartUpdate(0,0);
      //  //         _item.slideUp(250);
      //     // }
      //     if (qty == 0) { 
      //       _item.slideUp("250", function() { $(this).remove(); } );
      //     } else { 
      //         var price = _item.find('.qty_cart_js').attr('data-price')*qty;
      //         _item.find('.js_tt_price_it').html(geckoShopify.formatMoney(price));
      //     }
      //     geckoShopify.onCartUpdate(0,0);
          
      //   },
      //   error: function(XMLHttpRequest, textStatus) {
      //     geckoShopify.onError(XMLHttpRequest, textStatus);
      //   },
      //   complete: function() {
      //    // $ld_cart.addClass('on_end');
      //    _item.find('.ld_cart_bar').addClass('on_end');
      //    setTimeout(function(){ 
      //       _item.find('.ld_cart_bar').attr('class', '').addClass('ld_cart_bar');
      //       //  _item.find('.ld_cart_bar').attr('class', '').addClass('ld_cart_bar op__0 pe_none');
      //       //_item.removeClass('rm_op');
      //      nt_js_cart.removeClass('ld_nt_cl'); 
      //    }, 280);
      //   }
      // };
      // $.ajax(params);

      // Start case js fetch
        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;'
          },
          body: JSON.stringify({
            id: vid,
            quantity: qty
          })
        };

        fetch(cartChangeUrl, request)
          .then(function(response) {
            return response.json();
          })
          .then(function(cart) {

             if (qty == 0) { 
              _item.slideUp("250", function() { $(this).remove(); } );
             } else { 
                var price = _item.find('.qty_cart_js').attr('data-price')*qty;
                _item.find('.js_tt_price_it').html(geckoShopify.formatMoney(price));
             }
             geckoShopify.onCartUpdate(0,0);
             _item.find('.ld_cart_bar').addClass('on_end');
             setTimeout(function(){ 
                _item.find('.ld_cart_bar').attr('class', '').addClass('ld_cart_bar');
                //  _item.find('.ld_cart_bar').attr('class', '').addClass('ld_cart_bar op__0 pe_none');
                //_item.removeClass('rm_op');
               nt_js_cart.removeClass('ld_nt_cl'); 
             }, 280);
              body.trigger('CartUpdateSuccess CartChangeSuccess');

          })
          .catch(function(error) {
            // eslint-disable-next-line no-console
            console.log('cart change error: '+error);
          });
      // End case js fetch
    };

    geckoShopify.updateCartNote = function(note) {

      function attributeToString(attribute) {
        if (typeof attribute !== 'string') {
          attribute += '';
          if (attribute === 'undefined') {
            attribute = '';
          }
        }
        return $.trim(attribute);
      };
      
      // Start case js ajax

      // var params = {
      //   type: 'POST',
      //   url: '/cart/update.js',
      //   data: 'note=' + attributeToString(note),
      //   dataType: 'json',
      //   success: function(cart) {
      //     //geckoShopify.onCartUpdate(0,1);
      //     //console.log(attributeToString(note).length)
      //     if (attributeToString(note).length > 0) {
      //       $('.txt_edit_note').show();$('.txt_add_note').hide();
      //     } else {
      //       $('.txt_add_note').show();$('.txt_edit_note').hide();
      //     }
      //   },
      //   error: function(XMLHttpRequest, textStatus) {
      //     geckoShopify.onError(XMLHttpRequest, textStatus);
      //   }
      // };
      // $.ajax(params);
      
      // Start case js fetch
      var headers = new Headers({ 'Content-Type': 'application/json' }),
          note_txt = attributeToString(note);
      var request = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ note: note_txt })
      };

      fetch('/cart/update.js', request)
        .then(function(response) {
          return response.json();
        })
        .then(function(cart) {
          if (note_txt.length > 0) {
            $('.txt_edit_note').show();$('.txt_add_note').hide();
          } else {
            $('.txt_add_note').show();$('.txt_edit_note').hide();
          }
        })
        .catch(function(error) {
          console.log('cart update error: ',error);
        });
        // End case js fetch

    };

    geckoShopify.onItemAdded = function(line_item, quantity, callback) {
       geckoShopify.onCartUpdate(1,1);
       //setTimeout(function(){ $('.push_side.cart-contents').trigger('click'); }, 200);
       
      //alert(line_item.title + ' was added to your shopping cart.');
    };

    geckoShopify.WidgetCartUpdateMobile = function() {
       if ( $('.js_cart_footer').height() < $(window).height()/2 || $('#nt_cart_canvas').hasClass('fix_layout_mbt4') || window_w > 767 ) return;
       $('#nt_cart_canvas').addClass('fix_layout_mbt4');
    };
    
   // https://github.com/benevolenttech/jquery.confetti.js
   // globals var func CanvasConfetti
    var canvas,
        ctx,
        W,
        H,
        mp = 150, //max particles
        particles = [],
        angle = 0,
        tiltAngle = 0,
        confettiActive = true,
        animationComplete = true,
        deactivationTimerHandler,
        reactivationTimerHandler,
        animationHandler,
        ck_canvas = false;

    geckoShopify.CanvasConfetti = function(id) {
      // globals
      // var $canvas = $(id),
      //     ctx,
      //     W,
      //     H,
      //     mp = 150, //max particles
      //     particles = [],
      //     angle = 0,
      //     tiltAngle = 0,
      //     confettiActive = true,
      //     animationComplete = true,
      //     deactivationTimerHandler,
      //     reactivationTimerHandler,
      //     animationHandler;
      if (window.innerWidth < 988) {mp = 75;}

      // objects

      var particleColors = {
          colorOptions: ["DodgerBlue", "OliveDrab", "Gold", "pink", "SlateBlue", "lightblue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"],
          colorIndex: 0,
          colorIncrementer: 0,
          colorThreshold: 10,
          getColor: function () {
              if (this.colorIncrementer >= 10) {
                  this.colorIncrementer = 0;
                  this.colorIndex++;
                  if (this.colorIndex >= this.colorOptions.length) {
                      this.colorIndex = 0;
                  }
              }
              this.colorIncrementer++;
              return this.colorOptions[this.colorIndex];
          }
      }

      function confettiParticle(color) {
          this.x = Math.random() * W; // x-coordinate
          this.y = (Math.random() * H) - H; //y-coordinate
          this.r = RandomFromTo(10, 30); //radius;
          this.d = (Math.random() * mp) + 10; //density;
          this.color = color;
          this.tilt = Math.floor(Math.random() * 10) - 10;
          this.tiltAngleIncremental = (Math.random() * 0.07) + .05;
          this.tiltAngle = 0;

          this.draw = function () {
              ctx.beginPath();
              ctx.lineWidth = this.r / 2;
              ctx.strokeStyle = this.color;
              ctx.moveTo(this.x + this.tilt + (this.r / 4), this.y);
              ctx.lineTo(this.x + this.tilt, this.y + this.tilt + (this.r / 4));
              return ctx.stroke();
          }
      }

      function init() {
          SetGlobals();
          //InitializeButton();
          //InitializeConfetti();

          $(window).resize(function () {
              W = window.innerWidth;
              H = window.innerHeight;
              canvas.width = W;
              canvas.height = H;
          });

      }

      function InitializeButton() {
          //$('#startConfetti').click(InitializeConfetti);
          //$('#stopConfetti').click(DeactivateConfetti);
          //$('#restartConfetti').click(RestartConfetti);
      }

      function SetGlobals() {
          $('body').append('<canvas id="confettiCanvas" style="position:fixed;top:0;left:0;display:none;z-index:9999;pointer-events: none;"></canvas>');
          canvas = document.getElementById("confettiCanvas");
          ctx = canvas.getContext("2d");
          W = window.innerWidth;
          H = window.innerHeight;
          canvas.width = W;
          canvas.height = H;
      }

      function InitializeConfetti() {
          canvas.style.display = 'block';
          particles = [];
          animationComplete = false;
          for (var i = 0; i < mp; i++) {
              var particleColor = particleColors.getColor();
              particles.push(new confettiParticle(particleColor));
          }
          StartConfetti();
      }

      function Draw() {
          ctx.clearRect(0, 0, W, H);
          var results = [];
          for (var i = 0; i < mp; i++) {
              (function (j) {
                  results.push(particles[j].draw());
              })(i);
          }
          Update();

          return results;
      }

      function RandomFromTo(from, to) {
          return Math.floor(Math.random() * (to - from + 1) + from);
      }


      function Update() {
          var remainingFlakes = 0;
          var particle;
          angle += 0.01;
          tiltAngle += 0.1;

          for (var i = 0; i < mp; i++) {
              particle = particles[i];
              if (animationComplete) return;

              if (!confettiActive && particle.y < -15) {
                  particle.y = H + 100;
                  continue;
              }

              stepParticle(particle, i);

              if (particle.y <= H) {
                  remainingFlakes++;
              }
              CheckForReposition(particle, i);
          }

          if (remainingFlakes === 0) {
              StopConfetti();
          }
      }

      function CheckForReposition(particle, index) {
          if ((particle.x > W + 20 || particle.x < -20 || particle.y > H) && confettiActive) {
              if (index % 5 > 0 || index % 2 == 0) //66.67% of the flakes
              {
                  repositionParticle(particle, Math.random() * W, -10, Math.floor(Math.random() * 10) - 10);
              } else {
                  if (Math.sin(angle) > 0) {
                      //Enter from the left
                      repositionParticle(particle, -5, Math.random() * H, Math.floor(Math.random() * 10) - 10);
                  } else {
                      //Enter from the right
                      repositionParticle(particle, W + 5, Math.random() * H, Math.floor(Math.random() * 10) - 10);
                  }
              }
          }
      }
      function stepParticle(particle, particleIndex) {
          particle.tiltAngle += particle.tiltAngleIncremental;
          particle.y += (Math.cos(angle + particle.d) + 3 + particle.r / 2) / 2;
          particle.x += Math.sin(angle);
          particle.tilt = (Math.sin(particle.tiltAngle - (particleIndex / 3))) * 15;
      }

      function repositionParticle(particle, xCoordinate, yCoordinate, tilt) {
          particle.x = xCoordinate;
          particle.y = yCoordinate;
          particle.tilt = tilt;
      }

      function StartConfetti() {
          W = window.innerWidth;
          H = window.innerHeight;
          canvas.width = W;
          canvas.height = H;
          (function animloop() {
              if (animationComplete) return null;
              animationHandler = requestAnimFrameT4(animloop);
              return Draw();
          })();
      }

      function ClearTimers() {
          clearTimeout(reactivationTimerHandler);
          clearTimeout(animationHandler);
      }

      function DeactivateConfetti() {
        confettiActive = false;
        ClearTimers();
      }

      function StopConfetti() {
          animationComplete = true;
          if (ctx == undefined) return;
          ctx.clearRect(0, 0, W, H);
          canvas.style.display = 'none';
      }

      function RestartConfetti() {
          ClearTimers();
          StopConfetti();
          reactivationTimerHandler = setTimeout(function () {
              confettiActive = true;
              animationComplete = false;
              InitializeConfetti();
          }, 100);

      }

      window.requestAnimFrameT4 = (function () {
          return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
              return window.setTimeout(callback, 1000 / 60);
          };
      })();

      return {
        init: init,
       start: InitializeConfetti,
       stop: DeactivateConfetti,
       restart: RestartConfetti
      };

    };
    // geckoShopify.CanvasConfetti().init()
    // geckoShopify.CanvasConfetti().stop()
    function UpdateShipBar(str1, str2, this_thres) {
      if (str1.indexOf('___') !== -1) {
        var _aar1 = str2.split('___');
        this_thres.find('.mn_thres_js').html( _aar1[0] );
        $('.cart_bar_w').slideDown(200);
        var num_percent = 100 - parseInt(_aar1[1]),
            class_percent;

        if (num_percent < 10) {
          class_percent = 'less_10'
        } else {
          class_percent = 'more_10'
        }
        $('.cart_bar_w>span').removeClass('less_10 more_10').addClass(class_percent).css("width", num_percent+'%');
        //console.log(_aar1[1])
      } else {
        this_thres.find('.mn_thres_js').html( str2 );
        $('.cart_bar_w').slideUp(200);
        if (ck_canvas && show_confetti) {
          geckoShopify.CanvasConfetti().restart();
          setTimeout(function(){ geckoShopify.CanvasConfetti().stop() }, 3500);
        }
      }
    };

    geckoShopify.onCartUpdate = function(bl,blUp_items,id) {
      //console.log(blUp_items)
      if (body.hasClass('template-cart')) {
        if ($('.reload_cart_js').length > 0) {
          location.reload(); 
          return false;
        }
        
        fetch(cartUrl+'?view=pagejs', { credentials: 'same-origin' })
        .then(function(response) {
          return response.text();
        })
        .then(function(data) {
            var arrCat = data.split("<!--split-->");

            if (arrCat[0] != $('.jsccount').first().html() ) {
             if ( parseInt(arrCat[0]) == 0 ) {
                 $('.nt_js_cart, .js_cart_cd').hide();
                 $('.shipping_calc_page').addClass('dn');
                 $('.empty_cart_page').show();
              } else {
                 $('.empty_cart_page').hide();
                 $('.nt_js_cart, .js_cart_cd').show();
                 $('.shipping_calc_page').removeClass('dn');
              }

              $('.jsccount').html(arrCat[0])
              var aar1 = arrCat[1].split(',]'),
                  this_thres = $('.cart_thres_'+aar1[0]);
              if (aar1 != 'spt4') {

                if (this_thres.is(":hidden")) {
                  $('.cart_thres_1,.cart_thres_2,.cart_thres_3').slideUp(200);
                     this_thres.slideDown(250);
                }
                 if (arrCat[0] != 0 && $('.cart_thres_3').is(":hidden")) {
                  ck_canvas = true;
                 } else {
                  ck_canvas = false
                 }
                UpdateShipBar(arrCat[1],aar1[1],this_thres);
              }
              if (blUp_items) {$('.js_cat_items').html(arrCat[2]);}
              $('.js_cat_dics').html(arrCat[3]);
              $('.js_cat_ttprice').html(arrCat[4]);
                 
                 //console.log(arrCat[5])
              if (arrCat[5] == '1') {
                   $('.js_gift_wrap').addClass('dn');
              } else {
                   $('.js_gift_wrap').removeClass('dn');
              }

              body.trigger('refresh_currency');

              //if (bl && !body.hasClass('pside_opened')) {  $('.push_side[data-id="#nt_cart_canvas"]').trigger('click'); }
            }
            $('.nt_js_cart.loading, .js_addtc.loading, .js_frm_cart.loading, .js_add_group.loading, .sticky_atc_js.loading').removeClass('loading');
            $ld.trigger( "ld_bar_end" );
            if (blUp_items) {
               $('html, body').animate({
                    scrollTop: $('#shopify-section-cart-template').offset().top - 40
               }, 400);
            }
        })
        .catch(function(error) {
          // eslint-disable-next-line no-console
          console.log(error);
        });

        // $.get(cartUrl+'?view=pagejs', function(data) {
        //   var arrCat = data.split("<!--split-->");

        //   if (arrCat[0] != $('.jsccount').first().html() ) {
        //    if ( parseInt(arrCat[0]) == 0 ) {
        //        $('.nt_js_cart, .js_cart_cd').hide();
        //        $('.shipping_calc_page').addClass('dn');
        //        $('.empty_cart_page').show();
        //     } else {
        //        $('.empty_cart_page').hide();
        //        $('.nt_js_cart, .js_cart_cd').show();
        //        $('.shipping_calc_page').removeClass('dn');
        //     }

        //     $('.jsccount').html(arrCat[0])
        //     var aar1 = arrCat[1].split(',]'),
        //         this_thres = $('.cart_thres_'+aar1[0]);
        //     if (aar1 != 'spt4') {
        //          this_thres.find('.mn_thres_js').html( aar1[1] );
        //       if (this_thres.is(":hidden")) {
        //         $('.cart_thres_1,.cart_thres_2,.cart_thres_3').slideUp(200);
        //            this_thres.slideDown(250);
        //       }
        //     }
        //     if (blUp_items) {$('.js_cat_items').html(arrCat[2]);}
        //     $('.js_cat_dics').html(arrCat[3]);
        //     $('.js_cat_ttprice').html(arrCat[4]);
               
        //        //console.log(arrCat[5])
        //     if (arrCat[5] == '1') {
        //          $('.js_gift_wrap').addClass('dn');
        //     } else {
        //          $('.js_gift_wrap').removeClass('dn');
        //     }

        //     body.trigger('refresh_currency');

        //     //if (bl && !body.hasClass('pside_opened')) {  $('.push_side[data-id="#nt_cart_canvas"]').trigger('click'); }
        //   }
        //   $('.nt_js_cart.loading, .js_addtc.loading, .js_frm_cart.loading, .js_add_group.loading, .sticky_atc_js.loading').removeClass('loading');
        //   $ld.trigger( "ld_bar_end" );
        //   if (blUp_items) {
        //      $('html, body').animate({
        //           scrollTop: $('#shopify-section-cart-template').offset().top - 40
        //      }, 400);
        //   }
        // });
        
      } else {
        
        fetch(cartUrl+'?view=js', { credentials: 'same-origin' })
        .then(function(response) {
          return response.text();
        })
        .then(function(data) {
          var arrCat = data.split("<!--split-->");

          if (arrCat[0] != $('.jsccount').first().html() ) {
            if ( parseInt(arrCat[0]) == 0 ) {
               $('.nt_js_cart .js_cart_note,.nt_js_cart .js_cart_footer,.nt_js_cart .js_cart_tool,.js_cat_items,.js_cart_cd').hide();
               $('.nt_js_cart .empty').show();
               $('[data-cart-upsell-js]').html('');
            } else {
               $('.nt_js_cart .empty').hide();
               $('.nt_js_cart .js_cart_note,.nt_js_cart .js_cart_footer,.nt_js_cart .js_cart_tool,.js_cat_items,.js_cart_cd').show();
            }

            $('.jsccount').html(arrCat[0])
            var aar1 = arrCat[1].split(',]'),
                this_thres = $('.cart_thres_'+aar1[0]);
            if (aar1 != 'spt4') {
              //console.log(arrCat[1])
                if (this_thres.is(":hidden")) {
                  $('.cart_thres_1,.cart_thres_2,.cart_thres_3').slideUp(200);
                     this_thres.slideDown(250);
                }
                 if (arrCat[0] != 0 && $('.cart_thres_3').is(":hidden")) {
                  ck_canvas = true;
                 } else {
                  ck_canvas = false
                 }
              UpdateShipBar(arrCat[1],aar1[1],this_thres);
            }
            if (blUp_items) {$('.js_cat_items').html(arrCat[2]);}
            $('.js_cat_dics').html(arrCat[3]);
            $('.js_cat_ttprice').html(arrCat[4]);

            if (arrCat[5] == '1') {
              $('.js_cart_tls_back').trigger('click')
                 $('.js_gift_wrap').addClass('dn');
            } else {
                 $('.js_gift_wrap').removeClass('dn');
            }
               
               if ( $('.popup_uppr_wrap').length > 0 ) {
                 id = 19041994;
                 TriggerAfterATC(bl,id);
               } else if ($.magnificPopup.instance.isOpen){
              $.magnificPopup.close();
              setTimeout(function(){ TriggerAfterATC(bl,id); }, 505);
            } else {
              TriggerAfterATC(bl,id);
            }
               geckoShopify.WidgetCartUpdateMobile(); 
               body.trigger('refresh_currency');
              // open hidden sidebar cart
          }
          $('.nt_js_cart.loading, .js_addtc.loading, .js_frm_cart.loading, .js_add_group.loading, .sticky_atc_js.loading').removeClass('loading');
          $ld.trigger( "ld_bar_end" );
        })
        .catch(function(error) {
          // eslint-disable-next-line no-console
          console.log(error);
        });

        // $.get(cartUrl+'?view=js', function(data) {
        //   var arrCat = data.split("<!--split-->");

        //   if (arrCat[0] != $('.jsccount').first().html() ) {
        //     if ( parseInt(arrCat[0]) == 0 ) {
        //        $('.nt_js_cart .js_cart_note,.nt_js_cart .js_cart_footer,.nt_js_cart .js_cart_tool,.js_cat_items,.js_cart_cd').hide();
        //        $('.nt_js_cart .empty').show();
        //     } else {
        //        $('.nt_js_cart .empty').hide();
        //        $('.nt_js_cart .js_cart_note,.nt_js_cart .js_cart_footer,.nt_js_cart .js_cart_tool,.js_cat_items,.js_cart_cd').show();
        //     }

        //     $('.jsccount').html(arrCat[0])
        //     var aar1 = arrCat[1].split(',]'),
        //         this_thres = $('.cart_thres_'+aar1[0]);
        //     if (aar1 != 'spt4') {
        //          this_thres.find('.mn_thres_js').html( aar1[1] );
        //       if (this_thres.is(":hidden")) {
        //         $('.cart_thres_1,.cart_thres_2,.cart_thres_3').slideUp(200);
        //            this_thres.slideDown(250);
        //       }
        //     }
        //     if (blUp_items) {$('.js_cat_items').html(arrCat[2]);}
        //     $('.js_cat_dics').html(arrCat[3]);
        //     $('.js_cat_ttprice').html(arrCat[4]);

        //     if (arrCat[5] == '1') {
        //       $('.js_cart_tls_back').trigger('click')
        //          $('.js_gift_wrap').addClass('dn');
        //     } else {
        //          $('.js_gift_wrap').removeClass('dn');
        //     }
               
        //        if ( $('.popup_uppr_wrap').length > 0 ) {
        //          id = 19041994;
        //          TriggerAfterATC(bl,id);
        //        } else if ($.magnificPopup.instance.isOpen){
        //       $.magnificPopup.close();
        //       setTimeout(function(){ TriggerAfterATC(bl,id); }, 505);
        //     } else {
        //       TriggerAfterATC(bl,id);
        //     }
        //        geckoShopify.WidgetCartUpdateMobile(); 
        //        body.trigger('refresh_currency');
        //       // open hidden sidebar cart
        //   }
        //   $('.nt_js_cart.loading, .js_addtc.loading, .js_frm_cart.loading, .js_add_group.loading, .sticky_atc_js.loading').removeClass('loading');
        //   $ld.trigger( "ld_bar_end" );
        // });
      }
    };
     
     var after_action_atc = nt_settings.after_action_atc;
     function TriggerAfterATC(bl,id) {
        // after_action_atc 0 1 2 3 4
        if (!bl || after_action_atc == '0') return;
        
        if ( after_action_atc == '1') {
          // show popup
         var html = [
            '<div class="added-to-cart">',
            '<p>' + nt_settings.added_to_cart + '</p>',
            '<a href="#" class="btn btn-style-link close-popup">' + nt_settings.continue_shopping + '</a>',
            '<a href="'+t_cart_url+'" class="button view-cart">' + nt_settings.view_cart + '</a>',
            '</div>',
         ].join("");

         $.magnificPopup.open({
            callbacks: {
               beforeOpen: function () {
                  this.st.mainClass = geckoTheme.popupAnimation + '  cart-popup-wrapper';
               },
            },
            items: {
               src: '<div class="white-popup add-to-cart-popup popup-added_to_cart">' + html + '</div>',
               type: 'inline'
            }
         });

         $('.white-popup').on('click', '.close-popup', function (e) {
            e.preventDefault();
            $.magnificPopup.close();
         });

        } else if ( after_action_atc == '2') {
          // show popup upsell
         //console.log(id);
         id = id || 19041994;

         if (id != 19041994)  {

           $.ajax({
              url: pr_re_url+'?section_id=re_upsell&product_id='+id,
              dataType: 'html',
              type: 'GET',
              success: function (section) {

                var recommendationsMarkup = $(section).html();
                //console.log(recommendationsMarkup);

                 if (recommendationsMarkup.trim() !== '') {
                    //_this.html(recommendationsMarkup);

                 $.magnificPopup.open({
                    items: {
                       src: '<div id="re_upsell_t4" class="popup_uppr_wrap container bgw mfp-with-anim">' + recommendationsMarkup + '</div>',
                       type: 'inline'
                    },
                    callbacks: {
                       beforeOpen: function () {
                          this.st.mainClass = geckoTheme.popupAnimation + '  cart-popup-wrapper';
                       },
                       open:function () {
                         var seat = $('.popup_uppr_wrap .pr_animated:not(.done)'),
                             $el = $('.popup_uppr_wrap .nt_slider');
                         //console.log(seat);
                         geckoShopify.class_sequentially(seat);
                          geckoShopify.refresh_flickity($el);
                          geckoShopify.flickityResposition(false,$el);
                          $('#re_upsell_t4 .swatch__list--calced').removeClass('swatch__list--calced');
                          geckoShopify.recalculateSwatches();
                          geckoShopify.InitCountdown();
                          geckoShopify.lazyWishUpdate();
                          geckoShopify.review();
                          body.trigger('refresh_currency');
                       },
                       close:function () {

                            TriggerSidebarDropdow();
                            $('.mini_cart_dis, .mini_cart_gift, .mini_cart_note, .mini_cart_ship').hide();
                            setTimeout(function(){ $('.mini_cart_dis, .mini_cart_gift, .mini_cart_note, .mini_cart_ship').show(); }, 350);

                       }
                    }
                 });

                } else {

                  TriggerSidebarDropdow();

                }

              },
             error: function() {},
             complete: function() {}
           });

         } else {
          TriggerSidebarDropdow();
         }
         // end check id 

        } else if ( after_action_atc == '3' ) {

          TriggerSidebarDropdow();

        } else {
          //Go to cart page
         document.location.href = t_cart_url;  
        }

     };

      function TriggerSidebarDropdow() {

        if (body.hasClass('pside_opened')) return;
          // Show hidden sidebar/dropdown
         if ( yes_hover && body.hasClass('cart_pos_dropdown')) {
          var $ic_cart = $('.cart_pos_dropdown .ntheader:not(.h_scroll_down) .icon_cart');
          //console.log($ic_cart);
          $ic_cart.trigger('mouseenter');
          } else {
            $('.push_side[data-id="#nt_cart_canvas"]').trigger('click'); 
          }
      };

    geckoShopify.spNotices = function() {
      var notices = '.shopify-error, .shopify-info, .shopify-message';

      $(sp_notices).on('click', notices, function () {
        var $msg = $(this);
        hideMessage($msg);
        $('.jscl_ld').removeClass('jscl_ld');
      });

      // var showAllMessages = function () {
      //  $notices.addClass('show_notice');
      // };

      // var hideAllMessages = function () {
      //  hideMessage($notices);
      // };

      var hideMessage = function ($msg) {
        $msg.removeClass('show_notice');
      };
    };

    geckoShopify.HideNotices = function() {
        $(sp_notices+' .show_notice').removeClass('show_notice');
    };

    geckoShopify.CreatNotices = function(txt) {
       $(sp_notices).html('<p class="shopify-info sp_notice"><i class="facl facl-attention"></i>'+txt+'<i class="pegk pe-7s-close"></i></p>');
       setTimeout(function(){ $(sp_notices+' .sp_notice').addClass('show_notice'); }, 200);
    };

    geckoShopify.onError = function(XMLHttpRequest, textStatus) {
      // Shopify returns a description of the error in XMLHttpRequest.responseText.
      // It is JSON.
      // Example: {"description":"The product 'Amelia - Small' is already sold out.","status":500,"message":"Cart Error"}

      $('.nt_js_cart.loading, .js_addtc.loading, .js_frm_cart.loading, .sticky_atc_js.loading').removeClass('loading');
      $ld.trigger( "ld_bar_end" );
      if ( nt_settings.disATCerror ) return;
      var data = eval('(' + XMLHttpRequest.responseText + ')');
      geckoShopify.CreatNotices(data.description);
    };

    geckoShopify.onError2 = function(error) {
      // Shopify returns a description of the error in XMLHttpRequest.responseText.
      // It is JSON.
      // Example: {"description":"The product 'Amelia - Small' is already sold out.","status":500,"message":"Cart Error"}

      $('.nt_js_cart.loading, .js_addtc.loading, .js_frm_cart.loading, .sticky_atc_js.loading').removeClass('loading');
      $ld.trigger( "ld_bar_end" );
      if ( nt_settings.disATCerror ) return;
      geckoShopify.CreatNotices(error);
    };

    geckoShopify.AgreeEmailCheckout = function() {
      
      if ( !nt_settings.checkbox_mail ) return;

      body.on('click', '.mail_agree', function(e) {

        e.preventDefault();e.stopPropagation();
        var frm = $(this).closest('form');
          if (frm.find('[type="email"]').val().length < 1 ) {
            frm.addClass('error_css_email');
            return false;
          }
          frm.addClass('error_css_checkbox');

      });

      body.on('keyup', '.js_mail_agree [type="email"]', function(e) {

        //e.preventDefault();e.stopPropagation();
        var frm = $(this).closest('form');
          if ($(this).val().length < 1 ) {
            frm.addClass('error_css_email');
          } else {
            frm.removeClass('error_css_email');
          }

      });

      body.on('click', 'input[type="checkbox"].css_agree_ck', function(e) {
        //e.preventDefault();
        var _form = $(this).closest('form'),
            _btn = _form.find('[type=submit]');
        
        if ($(this).is(':checked')) {
          _btn.removeClass('mail_agree');_form.removeClass('error_css_checkbox');
        } else {
            _btn.addClass('mail_agree');
          }
      });
    };

    var agree_checkout = nt_settings.agree_checkout,
        pe_none = 'pe_none';
    geckoShopify.AgreeCheckout = function() {
      
      if ( $('.js_agree_ck').length == 0 ) return;

      body.on('click', '[name="checkout"], [name="goto_pp"], [name="goto_gc"]', function(e) {
        var frm = $(this).closest('form');

        if (frm.find('.js_agree_ck').is(':checked')) {
          $(this).submit();
        }
        else {
          e.preventDefault();e.stopPropagation();
          geckoShopify.CreatNotices(agree_checkout);
        }
      });
      
      body.on('click', '.js_agree_ck', function(e) {
        var frm = $(this).closest('form'),
            ckt4 = frm.find('[data-add-ckt4]');

        if (frm.find('.js_agree_ck').is(':checked')) {
          geckoShopify.HideNotices();ckt4.removeClass(pe_none)
        }
        else {
          ckt4.addClass(pe_none)
        }
      });

      if ($('[data-agree-ckt4]').length == 0) return;

      body.on('click', '[data-agree-ckt4]', function(e) {
        var frm = $(this).closest('form'),
            ckt4 = frm.find('[data-add-ckt4]');

        if (frm.find('.js_agree_ck').is(':checked')) {
          ckt4.removeClass(pe_none)
        }
        else {
          geckoShopify.CreatNotices(agree_checkout);ckt4.addClass(pe_none);
          
        }
      });

    };

    geckoShopify.spQuantityAdjust = function(li) {

      if (!String.prototype.getDecimals) {
         String.prototype.getDecimals = function () {
            var num = this,
               match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
            if (!match) {
               return 0;
            }
            return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
         }
      }
      
      // quantity form add product page
      body.on( 'change','.qty_pr_js', function( e ) {
        //e.preventDefault();

          var _this = $(this),
              vid = _this.data('id'),
              qty = _this.val() || 1,
              max = _this.attr('max') || 9999,
              min = _this.attr('min') || 1,
              fgr_frm = _this.closest('.fgr_frm');
              
              if (fgr_frm.length > 0) {
                subtt_price_group(fgr_frm);
                body.trigger('refresh_currency');
              }
              
              geckoShopify.HideNotices();
               if (parseInt(qty) > parseInt(max)) { 
                  qty = max;_this.val(qty);

                 if ( nt_settings.disOnlyStock ) return;
                  var txt = $('#js_we_stcl').text() || 'Not enough items available. Only [max] left.'; 
                  geckoShopify.CreatNotices(txt.replace('[max]', max));
                  return false;
               } else if (parseInt(qty) < parseInt(min)) {
                  _this.val(min);
                  return false;
              }
      });

      body.on('click', '.plus, .minus', function (e) {
        e.preventDefault();
         // Get values
         var _this = $(this), 
            $qty = _this.closest('.quantity').find('input.qty'),
            currentVal = parseFloat($qty.val()),
            max = parseFloat($qty.attr('max')),
            min = parseFloat($qty.attr('min')),
            step = $qty.attr('step');

         // Format values
         if (!currentVal || currentVal === '' || currentVal === 'NaN') currentVal = 0;
         if (max === '' || max === 'NaN') max = '';
         if (min === '' || min === 'NaN') min = 0;
         if (step === 'any' || step === '' || step === undefined || parseFloat(step) === 'NaN') step = 1;
         geckoShopify.HideNotices();

         // Change the value
         if (_this.is('.plus')) {
            if (max && (currentVal >= max)) {
                $qty.val(max);

                if ( nt_settings.disOnlyStock ) return;
                var txt = $('#js_we_stcl').text() || 'Not enough items available. Only [max] left.'; 
                geckoShopify.CreatNotices(txt.replace('[max]', max));
                return false;

            } else {
               $qty.val((currentVal + parseFloat(step)).toFixed(step.getDecimals()));
            }
         } else {
            if (min && (currentVal <= min)) {
               $qty.val(min);
            } else if (currentVal > 0) {
               $qty.val((currentVal - parseFloat(step)).toFixed(step.getDecimals()));
            }
         }

         // Trigger change event
         $qty.trigger('change');
         
      });
    };

    geckoShopify.productImages =  function () {
      if (!body.hasClass('template-product')) return;
        var ck_cl = true,
           $productGallery = $('.product-images'),
           $single_thumbnail = $('.sp-single'),
           $mainImages = $('.p-thumb'),
           img_visible = $mainImages.find('.img_ptw:not(.is_varhide)'), 
           PhotoSwipeTrigger = '.show_btn_pr_gallery';

        if ($productGallery.hasClass('img_action_popup') || ($(window).width() <= 1024 && nt_settings.zoom_mb)) {
           PhotoSwipeTrigger += ', .p-thumb .img_ptw';
        }

        // check click
        //if (!jscd.mobile) {
           $('.p-thumb').on( 'dragEnd.flickity', function( event, pointer ) {
            ck_cl = false;
           });
        //}
        //$single_thumbnail.on('click', '.show_btn_pr_gallery', function (e) {ck_cl = true});

        $single_thumbnail.on('click', PhotoSwipeTrigger, function (e) {
           e.preventDefault();
           if($(this).hasClass('show_btn_pr_gallery')) {ck_cl = true}
           if (nt_settings.galleryType == 'mfp' && ck_cl) {
              $.magnificPopup.open({
                 type: 'image',
                 tClose: nt_settings.close,
                 image: {
                    verticalFit: false
                 },
                 items: getProductItems(),
                 gallery: {
                    enabled: true,
                    navigateByImgClick: false
                 },
              }, 0);
           } else if (nt_settings.galleryType == 'pswp' && ck_cl) {
              
              if ( $('.thumb_2').length > 0 || $('.thumb_3').length > 0 || $('.thumb_7').length > 0 ) {
                img_visible = $mainImages.find('.js-sl-item:not(.is_varhide) .img_ptw');
              } else {
                img_visible = $mainImages.find('.img_ptw:not(.is_varhide)');
              }
              // build items array
              var items = getProductItems(),
                  thumb_item = getProductItems('thumb'),
                  p_thumb = $('.pswp__thumbnails');
              
              if ( $('.p-thumb').hasClass('isotope_ok')) {
                var index = $(this).parents().index()
              } else {
                var index = getCurrentGalleryIndex(e)
              }
              if (index == -1) {
                index = 0;
              }
              //console.log(index);
              callPhotoSwipe(index, items);
               
              if (p_thumb.length > 0 && img_visible.length > 1) {
                 p_thumb.html(thumb_item);
                 $('.pswp_thumb_item:eq('+index+')').addClass('pswp_tb_active');
                 adjustMobileThumbPosition();
                 //console.log(thumb_item);
              }

           } else {
              ck_cl = true
           }

        });

        var callPhotoSwipe = function (index, items) {
           var pswpElement = document.querySelectorAll('.pswp_t4_js')[0],
               items_length = 0;
           $('.pswp_size_guide').removeClass('pswp_size_guide');
           $('.pswp_t4_js').addClass('pswp_pp_prs');

           if (_rtl) {
              items_length = items.length - 1;
              index = items_length - index;
              //index = items.length - index - 1;
              items = items.reverse();
           }

           // define options (if needed)
           var options = {
              history: false,
              maxSpreadZoom: nt_settings.maxSpreadZoom,
              bgOpacity: nt_settings.bgOpacity,
              showHideOpacity:($('.p-thumb').hasClass('nt_contain') || $('.p-thumb').hasClass('nt_cover')),
              index: index, // start at first slide
              shareButtons: [{
                    id: 'facebook',
                    label: nt_settings.share_fb,
                    url: 'https://www.facebook.com/sharer/sharer.php?u={{url}}'
                 },
                 {
                    id: 'twitter',
                    label: nt_settings.tweet,
                    url: 'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'
                 },
                 {
                    id: 'pinterest',
                    label: nt_settings.pin_it,
                    url: 'http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}'
                 }
              ],
             getThumbBoundsFn: function(index) {
                 
                 var thumbnail = $(".p-thumb .p_ptw:visible").eq(index)[0];
                 if ($mainImages.hasClass('isotope_ok')) {thumbnail = $(".p-thumb .p_ptw:visible").eq(index)[0];}

                 var pageYScroll = window.pageYOffset || document.documentElement.scrollTop, rect = thumbnail.getBoundingClientRect(); 
                 return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
             }
           };
           //console.log(options)

           // Initializes and opens PhotoSwipe
           var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
           gallery.init();
           
           //console.log(index);
           gallery.listen('afterChange', function() {
            //var i = gallery.getCurrentIndex();
             if (_rtl) {
               var i = items_length - gallery.getCurrentIndex();
             } else {
               var i = gallery.getCurrentIndex();
             }
              //console.log('afterChange'+i);
              $('.pswp_tb_active').removeClass('pswp_tb_active');
              $('.pswp_thumb_item:eq('+i+')').addClass('pswp_tb_active');
              adjustMobileThumbPosition();
           });

           //console.log($( ".pswp_thumb_item" ));
           $('.pswp_t4_js').off('click').on('click', '.pswp_thumb_item', function() {
             if (_rtl) {
               var i = items_length - $(this).index();
             } else {
               var i = $(this).index();
             }
             gallery.goTo(i)
            //gallery.goTo($(this).index());
           });

           gallery.listen('close', function() {
              
              setTimeout(function(){ 
                //console.log($('.pswp_pp_prs'));
                $('.pswp_pp_prs').removeClass('pswp_pp_prs'); 
              }, 500);
             if (_rtl) {
               var i = items_length - gallery.getCurrentIndex();
             } else {
               var i = gallery.getCurrentIndex();
             }
              //var i = gallery.getCurrentIndex();
              //$('.p-thumb.flickity-enabled').flickity( 'select', i )
              $('.p-thumb.flickity-enabled').flickity( 'select', i, false, true );
              //$(".pswp_thumb_item").off('click');
           });

        };

        // $('.product-infors').on('click', '.btn_size_guide', function (e) {
        //    e.preventDefault();
        //    callSizeGuide($(this));
        // });

        // var callSizeGuide = function ($this) {
        //    var el = document.querySelectorAll('.pswp_t4_js')[0];
        //    $('.pswp_t4_js').addClass('pswp_size_guide')
            
        //    // define options (if needed)
        //    var options = {
        //       history: false,
        //       maxSpreadZoom: 2,
        //       showHideOpacity: true,
        //       fullscreenEl: false,
        //       shareEl: false,
        //       counterEl: false,
        //       bgOpacity:1,
        //      getThumbBoundsFn: function(index) {
        //         var pageYScroll = window.pageYOffset || document.documentElement.scrollTop, rect = $this[0].getBoundingClientRect(); 
        //         return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
        //      }
        //    };

        //    // Initializes and opens PhotoSwipe
        //    var items = [],
        //        img_w = $this.attr('data-width') || 'nt_img' ,
        //        img_h = $this.attr('data-height') || 'nt_img' ,
        //        img_src = $this.attr('data-src');
        //       //console.log(img_w);
        //       //console.log(img_h);
        //    // if (img_w == 'nt_img' || img_h == 'nt_img') {
        //    //    var new_img = new Image();
        //    //    new_img.src = img_src; 
        //    //    new_img.onload = function() {
        //    //       //console.log('onload');
        //    //       img_w  = this.width;
        //    //       img_h = this.height;
        //    //       items.push({src: img_src,w: img_w,h: img_h,title: $this.text()});
        //    //       var img_size = new PhotoSwipe(el, PhotoSwipeUI_Default, items, options);
        //    //       img_size.init();
        //    //    }
              
        //    // } else {
        //    //    items.push({src: img_src,w: img_w,h: img_h,title: $this.text()});
        //    //    var img_size = new PhotoSwipe(el, PhotoSwipeUI_Default, items, options);
        //    //    img_size.init();
        //    // }
        //    items.push({src: img_src,w: img_w,h: img_h,title: $this.text()});
        //    var img_size = new PhotoSwipe(el, PhotoSwipeUI_Default, items, options);
        //    img_size.init();
           

        //    // img_size.listen('close', function() {
        //    //    $('.pswp_size_guide').removeClass('pswp_size_guide') 
        //    // });
        // };

        var getCurrentGalleryIndex = function (e) {
          //console.log(e.currentTarget)
           if ($mainImages.hasClass('flickity-enabled')) 
              return $mainImages.find('.js-sl-item.is-selected').index();
           else if ($(e.currentTarget).hasClass('show_btn_pr_gallery')) 
            return 0
           else return $(e.currentTarget).index();
        };

        var getProductItems = function (getvl) {
            //console.log(' run getProductItems');
           var items = [],
               _html ='',
               img_url = '{width}x',
               img;

           img_visible.each(function () {
              var $this = $(this),
                 src = $this.attr('data-src'),
                 width = $this.attr('data-width'),
                 height = $this.attr('data-height'),
                 caption = $this.data('cap'),
                 img = $(this).data('bgset');

              items.push({
                 src: src,
                 w: width,
                 h: height,
                 title: (nt_settings.img_captions) ? caption : false
              });

              _html += '<div class="pswp_thumb_item"><img class="lazyload lz_op_ef" src="data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20'+width+'%20'+height+'%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3C%2Fsvg%3E" data-src="'+img.replace('1x1',img_url)+'" data-widths="[50, 100]" data-sizes="auto"></div>'

           });
            
           if ( getvl == 'thumb') {
            return _html;
           } else {
            return items;
           }
           
        };

        var adjustMobileThumbPosition = function (){
           if (!small767 ) return;
          var selectedThumb = $('.pswp_tb_active')[0],
              $pswp__thumb = $('.pswp__thumbnails'),
              thumbContainer = $pswp__thumb[0],
              thumbBounds = selectedThumb.getBoundingClientRect(),
              thumbWrapperBounds = thumbContainer.getBoundingClientRect();

          if (thumbBounds.left + thumbBounds.width > thumbWrapperBounds.width) {
            //thumbContainer.scrollLeft = selectedThumb.offsetLeft + thumbBounds.width - thumbWrapperBounds.width + 10;
            $pswp__thumb.animate({scrollLeft: selectedThumb.offsetLeft + thumbBounds.width - thumbWrapperBounds.width + 10}, 200);
          } else if (selectedThumb.offsetLeft < thumbContainer.scrollLeft) {
            //thumbContainer.scrollLeft = selectedThumb.offsetLeft - 10;
            $pswp__thumb.animate({scrollLeft: selectedThumb.offsetLeft - 10}, 200);
           }
        };

        /* Zoom product img  */

        // if ($productGallery.hasClass('img_action_zoom') && Modernizr.hovermq ) {
        //    var zoom_target = $('.p-thumb .img_ptw'),ck_z = true;
        //    if ($(zoom_target[0]).find('.p_ptw').length > 0) { ck_z = false}
        //    var zoom_width = $('.sp-pr-gallery').width();
        //    zoom_target.each(function () {
        //       var $this = $(this);
        //       // if ($this.attr('data-width') > ($this.width() + 30) ) {
        //       if ($this.attr('data-width') > zoom_width ) {
        //          if (ck_z) { var $el = $this } else { var $el = $this.find('.p_ptw') }
        //          $el.zoom({
        //             url: $this.attr('data-src'),
        //             magnify: nt_settings.z_magnify, //1
        //             touch: nt_settings.z_touch
        //          });
        //       }
        //    });
        // }
      
      // disable mobile not scroll slider 
      if (!$productGallery.hasClass('img_action_zoom') || window_w < 1025 ) return;
      var p_thumb = $('.p-thumb'),
          p_infors = $('.product-infors'),
          zoom_target = $('.p-thumb .img_ptw'),
          dt_zoom_img = $('.dt_img_zoom')[0],
          zoom_tp = nt_settings.zoom_tp,
          z_magnify = nt_settings.z_magnify,
          z_touch = nt_settings.z_touch;

      if (zoom_tp == '2' && ($('.thumb_2').length > 0 || $('.thumb_3').length > 0 || $('.thumb_7').length > 0)) {
         zoom_tp = '1';
         body.removeClass('zoom_tp_2').addClass('zoom_tp_1');
      }
      zoom_target.each(function () {
        var $this = $(this),
            _this = $this[0],
            w = $this.attr('data-width'),
            h = $this.attr('data-height');

      // new Drift(_this, {
      //  sourceAttribute: 'data-src',
    //        paneContainer: nt_settings.zoom_tp == '2' ? dt_zoom_img : _this,
    //        zoomFactor: nt_settings.z_magnify,
    //        inlinePane: false,
    //        hoverBoundingBox: nt_settings.zoom_tp == '2', //false , true
    //        handleTouch: nt_settings.z_touch,
    //        onShow: function onShow() {
    //          p_thumb.addClass('zoom_fade_ic');
    //          p_infors.addClass('zoom_fade_if');
    //          // setTimeout(function(){ 
    //          //  $('.drift-zoom-pane img').css({
    //          //    "max-width": w+'px', 
    //          //    "max-height": h+'px'
    //          //  }); 
    //          // }, 100);
            
    //        },
    //        onHide: function onHide() {
    //          p_thumb.removeClass('zoom_fade_ic');
    //          p_infors.removeClass('zoom_fade_if');
    //        } 
      // });
      new Drift(_this, {
        sourceAttribute: 'data-src',
           paneContainer: zoom_tp == '2' ? dt_zoom_img : _this,
           zoomFactor: z_magnify,
           inlinePane: zoom_tp == '3',
           hoverBoundingBox: zoom_tp == '2', //false , true
           handleTouch: false,
           //containInline: true,
           onShow: function onShow() {
            p_thumb.addClass('zoom_fade_ic');
            p_infors.addClass('zoom_fade_if');
            // setTimeout(function(){ 
            //  $('.drift-zoom-pane img').css({
            //    "max-width": w+'px', 
            //    "max-height": h+'px'
            //  }); 
            // }, 100);
            
           },
           onHide: function onHide() {
            p_thumb.removeClass('zoom_fade_ic');
            p_infors.removeClass('zoom_fade_if');
           } 
      });
      });

    // var triggerEl = $(".sp-pr-gallery__img")[0];
    // var drift = new Drift(document.querySelector('.sp-pr-gallery__img'), {
    //  sourceAttribute: 'data-src',
  //        paneContainer: triggerEl,
  //        zoomFactor: 3,
  //        inlinePane: false,
  //        hoverBoundingBox: false,
  //        handleTouch: false
    // });

    // var drift = new Drift(document.querySelector('.sp-pr-gallery__img'), {
    //  sourceAttribute: 'data-src',
  //        paneContainer: document.querySelector('[data-zoomed-image]'),
  //        zoomFactor: 3,
  //        inlinePane: false,
  //        hoverBoundingBox: true,
  //        handleTouch: false
    // });

    };
     

     function callgalleryPhotoSwipe(index, items) {
        var pswpElement = document.querySelectorAll('.pswp_t4_js')[0];

        if (_rtl) {
           index = items.length - index - 1;
           items = items.reverse();
        }

        // define options (if needed)
        // var options = {
        //    // optionName: 'option value'
        //    // for example:
        //    index: index, // start at first slide
        //    shareButtons: [
        //       { id: 'facebook', label: nt_settings.share_fb, url:'https://www.facebook.com/sharer/sharer.php?u={{url}}' },
        //       { id: 'twitter', label: nt_settings.tweet, url:'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'},
        //       {id: 'pinterest', label: nt_settings.pin_it, url:'http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}'}
        //    ]
        // };
        var options = {
           history: false,
           maxSpreadZoom: 2,
           showHideOpacity: true,
           fullscreenEl: false,
           shareEl: false,
           counterEl: false,
           bgOpacity:1,
          index: index, // start at first slide
          shareButtons: [
              { id: 'facebook', label: nt_settings.share_fb, url:'https://www.facebook.com/sharer/sharer.php?u={{url}}' },
              { id: 'twitter', label: nt_settings.tweet, url:'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'},
              {id: 'pinterest', label: nt_settings.pin_it, url:'http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}'}
          ]
        };

        // Initializes and opens PhotoSwipe
        var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
     };
     
     function callSizeGuide($this) {
           var el = document.querySelectorAll('.pswp_t4_js')[0];
           $('.pswp_t4_js').addClass('pswp_size_guide')
            
           // define options (if needed)
           var options = {
              history: false,
              maxSpreadZoom: 2,
              showHideOpacity: true,
              fullscreenEl: false,
              shareEl: false,
              counterEl: false,
              bgOpacity:1,
             getThumbBoundsFn: function(index) {
                var pageYScroll = window.pageYOffset || document.documentElement.scrollTop, rect = $this[0].getBoundingClientRect(); 
                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
             }
           };

           // Initializes and opens PhotoSwipe
           var items = [],
               img_w = $this.attr('data-width') || 'nt_img' ,
               img_h = $this.attr('data-height') || 'nt_img' ,
               img_src = $this.attr('data-src');
              //console.log(img_w);
              //console.log(img_h);
           // if (img_w == 'nt_img' || img_h == 'nt_img') {
           //    var new_img = new Image();
           //    new_img.src = img_src; 
           //    new_img.onload = function() {
           //       //console.log('onload');
           //       img_w  = this.width;
           //       img_h = this.height;
           //       items.push({src: img_src,w: img_w,h: img_h,title: $this.text()});
           //       var img_size = new PhotoSwipe(el, PhotoSwipeUI_Default, items, options);
           //       img_size.init();
           //    }
              
           // } else {
           //    items.push({src: img_src,w: img_w,h: img_h,title: $this.text()});
           //    var img_size = new PhotoSwipe(el, PhotoSwipeUI_Default, items, options);
           //    img_size.init();
           // }
           items.push({src: img_src,w: img_w,h: img_h,title: $this.text()});
           var img_size = new PhotoSwipe(el, PhotoSwipeUI_Default, items, options);
           img_size.init();
           

           // img_size.listen('close', function() {
           //    $('.pswp_size_guide').removeClass('pswp_size_guide') 
           // });
        };

    geckoShopify.galleryPhotoSwipe = function () {

        $(document).on('click', '.btn_size_guide', function (e) {
           e.preventDefault();
           callSizeGuide($(this));
        });
        
        $(document).on('click', '.nt_gallery_item a', function (e) {
           e.preventDefault();
           var $parent = $(this).parents('.nt_gallery_item'),
               holder = $(this).closest('.type_gallery'),
               index = $parent.index(),
               items = getGalleryImages(holder);
           callgalleryPhotoSwipe(index, items);
        });

        var getGalleryImages = function (el) {
           var items = [];
           el.find('a').each(function () {
              items.push({
                 src: $(this).attr('data-src'),
                 w: $(this).attr('data-w'),
                 h: $(this).attr('data-h')
              });
           });
           return items;
        };
    };

     geckoShopify.ajaxPPjs = function () {
      var ajax_pp = $('.ajax_pp_js');
      if (ajax_pp.length == 0) return;

         if ( sp_nt_storage ) {
          ajax_pp.each(function () {
            sessionStorage.removeItem($(this).attr('data-id'));
          });
         }

         ajax_pp.click(function(e){
             e.preventDefault();
             var _this = $(this),
                 url = _this.attr('data-url'),
                 id = _this.attr('data-id'),
                 title = _this.attr('data-title'),
                 prUrl = _this.attr('data-handle'),
                 data = null;

               if ( sp_nt_storage ) { data = sessionStorage.getItem(id); }
          
          if (data != null) {
               OpenMFP(data,id,title,prUrl);
              // _this.removeClass('loading');
          } else {
            _this.addClass('loading');
            $ld.trigger( "ld_bar_60" )
           setTimeout(function(){ $ld.trigger( "ld_bar_80" ) }, 80);
            $.ajax({
                url: url,
                dataType: 'html',
                type: 'GET',
                success: function(data) {
                  OpenMFP(data,id,title,prUrl);
                  if (sp_nt_storage) { sessionStorage.setItem(id, data) }
                },
                complete: function() {
                    _this.removeClass('loading');
                    $ld.trigger( "ld_bar_end" );
                },
                error: function() {
                  console.log('ajax_pp_js error');
                },
            });
         }
      });

      var OpenMFP = function (data,id,title,prUrl) { 
         $.magnificPopup.open({
             items: {
                 src: '<div class="mfp-with-anim white-popup ajax_pp_popup '+id+'">' + data + '</div>',
                 type: 'inline'
             },
             removalDelay: 500,
             callbacks: {
                 beforeOpen: function() {
                     this.st.mainClass = 'mfp-move-horizontal';
                 },
                open: function() {
                  $('#ContactFormAsk-product').val(title+' '+prUrl);
                },
                close: function() {}
             },
         });
      };
      
    };

    geckoShopify.getRandomInt = function (min, max) {
         return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    geckoShopify.progressbar = function (id,qty) {
        
        var $id = $(id);
        if ($id.length == 0) return;
        
        $id.removeAttr('data-ttcalc');
        var pr_id = $id.data('prid');
        var updateMeter = function (a, remaining_items,bgprocess,bgten) {
            //if(sp_nt_storage) {res = sessionStorage.getItem('qv'+ntid)}
            remaining_items =  parseInt(remaining_items);
            if(sp_nt_storage) {sessionStorage.setItem('probar'+pr_id, remaining_items)}
           total_items = $id.attr('data-ttcalc') || (total_items > remaining_items) ? total_items : remaining_items + total_items;
           $id.attr('data-ttcalc',total_items);
           //console.log('total_items: '+total_items)
           var b = 100 * remaining_items / total_items,
            color = (remaining_items < 10) ? bgten : bgprocess;
           a.find('.progressbar>div').css("background-color", color);
           //a.find('.progressbar').addClass('progress_bar');
           setTimeout(function () {
              a.find('.progressbar>div').css('width', b + '%');
              //a.find('.progressbar').removeClass('progress_bar')
           }, 300);
        };
        
        var total_items = parseInt($id.data('total')),
           min_items_left = parseInt($id.data('min')),
           max_items_left = parseInt($id.data('max')),
           dt_type = $id.data('type'),
           bgprocess = $id.data('bgprocess'),
           bgten = $id.data('bgten'),
           timer = null,
           timerinterval = null,
           min_of_remaining_items = 1,
           decrease_after = 1.7,
           decrease_after_first_item = 0.17, 
           remaining_items = qty || geckoShopify.getRandomInt(min_items_left, max_items_left);
           //decrease_after: 1.7 min, 102 sec ; decrease_after_first_item: 10.2 sec 
           //console.log(min_items_left)
           if(sp_nt_storage && !designMode && dt_type == 'ATC_NONE') {
              var getse_re = sessionStorage.getItem('probar'+pr_id);
              if (getse_re > 0) {
                remaining_items = getse_re;
              }
           }

        $id.find(".count").text(remaining_items).css({'background-color': '#fff','color': bgprocess});
        $id.find('.message').show();
        $id.find('.progressbar').show();
        updateMeter($id, remaining_items,bgprocess,bgten);
        
        if (dt_type == 'ATC') return;

        timer = setTimeout(function () {
           //console.log(remaining_items)
           //console.log('timer: '+remaining_items)
           remaining_items--;
           if (remaining_items < min_of_remaining_items) {
              remaining_items = qty || geckoShopify.getRandomInt(min_items_left, max_items_left)
           }
           $id.find('.count').css({'background-color': bgprocess,'color': '#fff'});
           setTimeout(function () {
              $id.find('.count').css({'background-color': '#fff','color': bgprocess});
           }, 1000 * 60 * 0.03);
           $id.find('.count').text(remaining_items);
           updateMeter($id, remaining_items,bgprocess,bgten)
        }, 1000 * 60 * decrease_after_first_item);
        //1000 * 60 * decrease_after_first_item

        timerinterval = setInterval(function () {
           //console.log('timerinterval: '+remaining_items)
           remaining_items--;
           // if (typeof qty !== 'undefined' && remaining_items < min_of_remaining_items) {
           //   remaining_items = 0;
           // } else if (remaining_items < min_of_remaining_items) {
           //    remaining_items = qty || geckoShopify.getRandomInt(min_items_left, max_items_left)
           // }
           if (remaining_items < min_of_remaining_items) {
              remaining_items = qty || geckoShopify.getRandomInt(min_items_left, max_items_left)
           }
           $id.find('.count').css({'background-color': bgprocess,'color': '#fff'});
           setTimeout(function () {
              $id.find('.count').css({'background-color': '#fff','color': bgprocess});
           }, 1000 * 60 * 0.03);
           $id.find(".count").text(remaining_items);
           updateMeter($id, remaining_items,bgprocess,bgten)
        }, 1000 * 60 * decrease_after);
        //1000 * 60 * decrease_after
        $id.bind("cleart", function(){
          clearTimeout(timer);
          clearInterval(timerinterval);
        });

    };

    geckoShopify.progressbarUpdateATC = function (el,qty) {

      if (el.data('type') != 'ATC') return;
       //el.trigger('cleart');
    
       //if (!bl) return;
        var pr_id = el.data('prid');
       //if(sp_nt_storage) { var get_count = sessionStorage.getItem('probar'+pr_id)}

       var _count = el.find('.count'),
           qty = parseInt(qty) || 1,
           //get_count = get_count || _count.text(),
           vl_count = parseInt(el.data('cur')) - qty;
       if (vl_count < 1)  return;
       
       //update count
       _count.text(vl_count);

       //update progressbar
       var bgprocess = el.data('bgprocess'),
           bgten = el.data('bgten'),
           total_items = el.attr('data-ttcalc'),
           b = 100 * vl_count / total_items,
           color = (vl_count < 10) ? bgten : bgprocess;

       // el.find('.progressbar>div').css("background-color", color);
       // el.find('.progressbar>div').css('width', b + '%');
       el.find('.progressbar>div').css({"background-color": color, 'width': b + '%'});
       //if(sp_nt_storage) {sessionStorage.setItem('probar'+pr_id, vl_count)}

    };

    geckoShopify.real_time = function (id) {
        var $id = $(id);
        //console.log( $(id));
        if ($id.length == 0) return;

        var min = $id.data('min'),
        max = $id.data('max'),
        interval = $id.data('interval'),
        o = geckoShopify.getRandomInt(min,max),
        n = ["1", "2", "4", "3", "6", "10", "-1", "-3", "-2", "-4", "-6"],
        l = ["10", "20", "15"],
        h = "",
        e = "",
        M = "";
        //console.log(min)
         
        setInterval(function () {

           if (h = Math.floor(Math.random() * n.length), e = n[h], o = parseInt(o) + parseInt(e), min >= o) {
              M = Math.floor(Math.random() * l.length);
              var a = l[M];
              o += a
           }
           if (o < min || o > max) {
              o = geckoShopify.getRandomInt(min,max);
           }
           $id.find(".count").html((parseInt(o)));
           $id.show();

        }, interval);
     };

    geckoShopify.flashSold = function (id) {
        var $id = $(id);
        if ($id.length == 0) return;

        var mins = $id.data('mins'),
            maxs = $id.data('maxs'),
            mint = $id.data('mint'),
            maxt = $id.data('maxt'),
            dataID = $id.data('id'),
            getS = sessionStorage.getItem("soldS"+dataID) || geckoShopify.getRandomInt(mins,maxs),
            getT = sessionStorage.getItem("soldT"+dataID) || geckoShopify.getRandomInt(mint,maxt),
            numS = parseInt(getS),
            numT = parseInt(getT),
            intervalTime = parseInt($id.data('time'));

        function UpdateSold(num1,num2) {
           $id.find(".nt_pr_sold").html(num1);
           $id.find(".nt_pr_hrs").html(Math.floor(numT));
           sessionStorage.setItem("soldS"+dataID, num1);
           sessionStorage.setItem("soldT"+dataID, num2);
        };

        UpdateSold(numS,numT);
        $id.show();

        setInterval(function() {
          numS = numS + geckoShopify.getRandomInt(1,4);
          numT = numT + (Math.random() * (0.8 - 0.1) + 0.1).toFixed(1)*1;

          UpdateSold(numS,numT);

        }, intervalTime);
    };
    
    geckoShopify.ATC_animation = function (id) {
      var $id = $(id);
      if ($id.length == 0 || $id.data('ani') == 'none') return;

       var animation = "animated "+$id.data('ani'),
          intervalTime = parseInt($id.data('time')),
          animTime = 1000;

       // if ( id == '#callBackVariant_ppr .single_add_to_cart_button') {
       //  $id = $(id+', .sticky_atc_js');
       // }
      function ATC_animation() {
          setInterval(function() {
              $id.addClass(animation);
              setTimeout(function(){ 
                 $id.removeClass(animation);
              }, animTime);
          }, intervalTime);
      };
       ATC_animation();
    };
    
    function getToday(setday, format, day) { 
      var arrd = $('#order_day').text().replace(/ /g,'').split(","),
       arrm = $('#order_mth').text().replace(/ /g,'').split(","),
       days = ArrUnique(arrd),
       months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
       monthNames = ArrUnique(arrm),
       d = (day !== '') ? new Date(day) : new Date();

      d.setDate(d.getDate()+setday);

      var getDate = d.getDate(),
          ww = days[d.getDay()],
          dd = ("0" + getDate).slice(-2),
          dst = day_suffix(getDate),
          mm = months[d.getMonth()], //January is 0! today.getMonth()+1
          mmn = monthNames[d.getMonth()],
          yyyy = d.getFullYear();
      
      switch(format) {
        case 0:
          // 19940419
          return yyyy+''+mm+''+dd;
          break;
        case 1:
          // Wednesday, 19th April
          return ww+', '+dst+' '+mmn;
          break;
        case 2:
          // Wednesday, 19th April 2019
          return ww+', '+dst+' '+mmn+' '+yyyy;
          break;
        case 3:
          // Wednesday, 19th April, 2019
          return ww+', '+dst+' '+mmn+', '+yyyy;
          break;
        case 4:
          // Wednesday, April 19th, 2019
          return ww+', '+mmn+' '+dst+', '+yyyy;
          break;
        case 5:
          // Wednesday, April 19th
          return ww+', '+mmn+' '+dst;
          break;
        case 6:
          // Wednesday, April 19th 2019
          return ww+', '+mmn+' '+dst+' '+yyyy;
          break;
        case 7:
          // Wednesday, April 19
          return ww+', '+mmn+' '+dd;
          break;
        case 8:
          // Wednesday, April 19 2019
          return ww+', '+mmn+' '+dd+' '+yyyy;
          break;
        case 9:
          // Wednesday, 04/19/2019
          return ww+', '+mm+'/'+dd+'/'+yyyy;
          break;
        case 10:
          // Wednesday, 19/04/2019
          return ww+', '+dd+'/'+mm+'/'+yyyy;
          break;
        case 11:
          // 2019/04/19 use countdown
          return yyyy+'/'+mm+'/'+dd;
          break;
        default:
          // Wednesday, 2019/04/19, case:20
          return ww+', '+yyyy+'/'+mm+'/'+dd;
      }
    };
    
    function ArrUnique(arr) { 
      var onlyUnique = function (value, index, self) { 
          return self.indexOf(value) === index;
      };
      return arr.filter( onlyUnique );
    };
    
    function day_suffix(n) { 
      if (n >= 11 && n <= 13) {return n+"th";}
       switch (n % 10) {
           case 1:  return n+"st";
           case 2:  return n+"nd";
           case 3:  return n+"rd";
           default: return n+"th";
       }
    };
    
    // function InitTimzone(timzone) { 
    //     var JsonTimeZone = {
    //     "ACDT":"+1030",
    //     "ACST":"+0930",
    //     "ADT":"-0300",
    //     "AEDT":"+1100",
    //     "AEST":"+1000",
    //     "AHDT":"-0900",
    //     "AHST":"-1000",
    //     "AST":"-0400",
    //     "AT":"-0200",
    //     "AWDT":"+0900",
    //     "AWST":"+0800",
    //     "BAT":"+0300",
    //     "BDST":"+0200",
    //     "BET":"-1100",
    //     "BST":"-0300",
    //     "BT":"+0300",
    //     "BZT2":"-0300",
    //     "CADT":"+1030",
    //     "CAST":"+0930",
    //     "CAT":"-1000",
    //     "CCT":"+0800",
    //     "CDT":"-0500",
    //     "CED":"+0200",
    //     "CET":"+0100",
    //     "CEST":"+0200",
    //     "CST":"-0600",
    //     "EAST":"+1000",
    //     "EDT":"-0400",
    //     "EED":"+0300",
    //     "EET":"+0200",
    //     "EEST":"+0300",
    //     "EST":"-0500",
    //     "FST":"+0200",
    //     "FWT":"+0100",
    //     "GMT":"GMT",
    //     "GST":"+1000",
    //     "HDT":"-0900",
    //     "HST":"-1000",
    //     "IDLE":"+1200",
    //     "IDLW":"-1200",
    //     "IST":"+0530",
    //     "IT":"+0330",
    //     "JST":"+0900",
    //     "JT":"+0700",
    //     "MDT":"-0600",
    //     "MED":"+0200",
    //     "MET":"+0100",
    //     "MEST":"+0200",
    //     "MEWT":"+0100",
    //     "MST":"-0700",
    //     "MT":"+0800",
    //     "NDT":"-0230",
    //     "NFT":"-0330",
    //     "NT":"-1100",
    //     "NST":"+0630",
    //     "NZ":"+1100",
    //     "NZST":"+1200",
    //     "NZDT":"+1300",
    //     "NZT":"+1200",
    //     "PDT":"-0700",
    //     "PST":"-0800",
    //     "ROK":"+0900",
    //     "SAD":"+1000",
    //     "SAST":"+0900",
    //     "SAT":"+0900",
    //     "SDT":"+1000",
    //     "SST":"+0200",
    //     "SWT":"+0100",
    //     "USZ3":"+0400",
    //     "USZ4":"+0500",
    //     "USZ5":"+0600",
    //     "USZ6":"+0700",
    //     "UT":"-0000",
    //     "UTC":"-0000",
    //     "UZ10":"+1100",
    //     "WAT":"-0100",
    //     "WET":"-0000",
    //     "WST":"+0800",
    //     "YDT":"-0800",
    //     "YST":"-0900",
    //     "ZP4":"+0400",
    //     "ZP5":"+0500",
    //     "ZP6":"+0600"
    //     };
    //     return JsonTimeZone[timzone] || 'UTC'
    // };
      
    // function isValidDate(d) {
    //   return d instanceof Date && !isNaN(d);
    // };
    
    var timezone = nt_settings.timezone,
        bltimezone = (timezone != 'not4'),
        day_t4_js = moment();
    // console.log('day_t4_js: ',day_t4_js)  
  if (bltimezone) {  
    try {
      var timezoneDay = moment().tz(timezone);    
    } catch(err) {
      console.log('Timezone error 2: '+timezone);
      bltimezone = false;
    }
  }
         
    geckoShopify.InitCountdown_pr = function (id) {
      var $id = $(id);

      //console.log($id);
      if ($id.length == 0) return;

      var $txt = $(id+"_txt"),
         dta_time = $id.data('time') || '',
         time_js = '',
         arr = dta_time.replace("24:00:00", "23:59:59").split(','),
         local_date = day_t4_js.format('YYYY/MM/DD'),
         //local_date_2 = day_t4_js.format('YYYYMMDD'),
         local_time = day_t4_js.format('HHmmss'),
         loop = $id.data('loop'),
         last = arr.length,
         timezone = $id.data('timezone');

    // console.log('local_date: ',local_date)
    // console.log('local_date_2: ',local_date_2)
    // console.log('local_time: ',local_time)
      // console.log(local_date)
      if ($id.hasClass('nt_loop')) {
         // 1994/04/19 16:00:00
         //console.log(last)
         var shoph = bltimezone ? timezoneDay.format('HHmmss') : local_time,
             shophNumber = parseInt(shoph),
             shopt = bltimezone ? timezoneDay.format('YYYY/MM/DD') : local_date,
             ck = false,
             i, l = arr.length;

      // console.log('shoph: ',shophNumber)
      // console.log('shopt: ',shopt)
         for (i = 0; i < l; i++) {

            //console.log(i)
            if (parseInt(arr[i].replace(/:/g, "")) >= shophNumber) {
               // fix 24:00:00 error ios,safari
               time_js = arr[i]
               break;
            } else if ( i == last - 1 ) {
               //console.log("done or continue")
               ck = true;
               time_js = arr[i]
            }

         }

         local_date = shopt + ' ' + time_js;
         // output: 2020/11/02 8:00:00
        
         if (bltimezone) {
           dta_time = geckoShopify.getDateCountdown(local_date);
         } else {
           dta_time = new Date(local_date);
         }
         // console.log(local_date,dta_time);

         if (loop && ck) dta_time.setDate(dta_time.getDate()+1);

      } else {
         
         dta_time = dta_time

      }
      // console.log(dta_time)

      // install coundown
      //console.log('local_date: '+local_date)
      //console.log('dta_time: '+dta_time)
      var txt_day = $txt.find('.day').text(),
          txt_hr = $txt.find('.hr').text(),
          txt_min = $txt.find('.min').text(),
          txt_sec = $txt.find('.sec').text();
      $id.countdown(dta_time, {elapse: true})
      .on('update.countdown', function (event) {
        if (event.elapsed) {
           $id.html('');$txt.hide();
        } else {
           $txt.find('.mess_cd').show();
           $id.html(event.strftime('' +
          '<div class="block tc"><span class="flip-top">%-D</span><br><span class="label tu">' + txt_day + '</span></div>' +
          '<div class="block tc"><span class="flip-top">%H</span><br><span class="label tu">' + txt_hr + '</span></div>' +
          '<div class="block tc"><span class="flip-top">%M</span><br><span class="label tu">' + txt_min + '</span></div>' +
          '<div class="block tc"><span class="flip-top">%S</span><br><span class="label tu">' + txt_sec + '</span></div>'));
         }
      });
    };

    geckoShopify.delivery_order = function (selector) {

      var selectorCurent = $(selector);
      if (selectorCurent.length == 0) return;
         
         var today = new Date(),
             today2 = new Date(),i = 0,
             today3 = new Date(),j = 0,
             getDate = today.getDate(),
             dateStart = selectorCurent.data("ds") || 0,
             dateEnd = selectorCurent.data("de") || 0,
             mode = selectorCurent.data("mode"),
             frm = selectorCurent.data("frm"),
             time = selectorCurent.data("time").replace("24:00:00", "23:59:59") || '19041994',
             arr = ["SUN","MON","TUE","WED","THU","FRI","SAT"],
             excludeDays = selectorCurent.data("cut").replace(/ /g,'').split(","),
             order_bltimezone = selectorCurent.data("timezone"),
             local_time = (bltimezone && order_bltimezone) ? timezoneDay.format('HHmmss') : day_t4_js.format('HHmmss'),
             timeint = time.replace(/ /g,'').replace(/:/g,''),
             arr_d = time.replace(/ /g,'').split(':'),
             local_date = day_t4_js.format('YYYY/MM/DD'),
             shopt = (bltimezone && order_bltimezone) ? timezoneDay.format('YYYY/MM/DD') : local_date;

             //d.setHours(arr_d[0] || '19'); d.setMinutes(arr_d[1] || '04' ); d.setSeconds(arr_d[2] || '04');
         //console.log('local_time: '+local_time+', < timeint: '+timeint)
         // if (parseInt(local_time) >= parseInt(timeint)) {

         //   var lastDay = day_t4_js.add(1, 'day').toDate();

         // } else {
         //   // if (bltimezone && order_bltimezone) {
         //   //  //console.log('format: ',dayjs(timezoneDay).format('YYYY-MM-DD HH:mm:ss'))
         //   //  var lastDay = dayjs.tz(dayjs(timezoneDay).format('YYYY-MM-DD')+' '+time, timezone).toDate();
         //   // } else {
         //   //  var lastDay = moment().toDate();
         //   // }
         //   var lastDay = day_t4_js.toDate();
         // }
         local_date = shopt + ' ' + time;

         //console.log(local_time,timeint)
         if (bltimezone && order_bltimezone) {
           var lastDay = geckoShopify.getDateCountdown(local_date);
         } else {
           var lastDay = new Date(local_date);
         }
         //console.log('lastDay 0: ',lastDay)
         if (parseInt(local_time) >= parseInt(timeint)) lastDay.setDate(lastDay.getDate()+1);

         // lastDay.setHours(arr_d[0] || '19'); 
         // lastDay.setMinutes(arr_d[1] || '04' ); 
         // lastDay.setSeconds(arr_d[2] || '04');
         
         //console.log('timezoneDay: ', timezoneDay.format('YYYY/MM/DD HH:mm:ss') ,'timezoneDay toDate: ' ,timezoneDay.toDate())
         //console.log('lastDay: ',lastDay)
         //console.log(today2);
         // console.log("today2: ",today2);
         // console.log("today3: ",today3);
         // console.log("dateStart: ",dateStart);
         // console.log("dateEnd: ",dateEnd);
         // console.log("excludeDays: ",excludeDays);
         if (mode == '2') {
          // Shipping + delivery
            
            // START DATE
            today2.setDate( getDate );
        while (i < dateStart) {
          i++;
          today2.setDate( today2.getDate() + 1 );
              if (excludeDays.indexOf(arr[today2.getDay()]) > -1) {
                i--;
              }
        }
            // var i2 = 0;
            // for (i = 1; i <= dateStart; i++) {
            //   today2.setDate( today2.getDate() + 1 );
            //   console.log(i)
            //   console.log(arr[today2.getDay()])
            //   if (excludeDays.indexOf(arr[today2.getDay()]) > -1) {
            //    i2++;
            //   }
            // }
            // if (excludeDays.indexOf(arr[today2.getDay()]) > -1) {
            //   i2++;
            // }
            //console.log('excludeDays: ',excludeDays)
    //         console.log(today2,' i2: ', i2)
    //         today2.setDate( today2.getDate() + i2 );
    //         console.log(today2, arr[today2.getDay()])
        // while (excludeDays.indexOf(arr[today2.getDay()]) > -1) {
        //  console.log('ggg')
        //   today2.setDate( today2.getDate() + 1 );
        // }

            selectorCurent.find(".start_delivery").html(getToday(0,frm,today2));
            
            // END DATE
            today3.setDate( getDate );
        while (j < dateEnd) {
          j++;
          today3.setDate( today3.getDate() + 1 );
              if (excludeDays.indexOf(arr[today3.getDay()]) > -1) {
                j--;
              }
        }
    //         var j2 = 0;
    //         for (j = 1; j <= dateEnd; j++) {
    //           today3.setDate( today3.getDate() + 1 );
    //           // console.log(j)
    //           // console.log(arr[today3.getDay()])
    //           if (excludeDays.indexOf(arr[today3.getDay()]) > -1) {
    //            j2++;
    //           }
    //         }
    //         if (excludeDays.indexOf(arr[today3.getDay()]) > -1) {
    //            j2++;
    //         }
    //         // console.log('j2: ', j2)
    //         today3.setDate( today3.getDate() + j2 );
        // while (excludeDays.indexOf(arr[today3.getDay()]) > -1) {
        //   today3.setDate( today3.getDate() + 1 );
        // }
           selectorCurent.find(".end_delivery").html(getToday(0,frm,today3));

         } else {
          // only delivery

           today2.setDate( getDate + dateStart - 1 );
           //moment().add(30, 'days').toDate();
           do {
            //today2.setDate( getDate + dateStart + j ); j++;
            //today2.setDate( today2.getDate() + i ); i++;
            today2.setDate( today2.getDate() + 1 );

           } while (excludeDays.indexOf(arr[today2.getDay()]) > -1);
           //console.log("today2: ",today2);
           selectorCurent.find(".start_delivery").html(getToday(0,frm,today2));
           
           today3.setDate( getDate + dateEnd - 1 );
           do {
            //today3.setDate( getDate + dateEnd + j ); j++;
             //today3.setDate( today3.getDate() + j ); j++;
            today3.setDate( today3.getDate() + 1 );

           } while (excludeDays.indexOf(arr[today3.getDay()]) > -1);
           //console.log("today3: ",today3);
           selectorCurent.find(".end_delivery").html(getToday(0,frm,today3));

        }

         if (time != '19041994') {
            var $id = selectorCurent.find('.h_delivery'); 

            $id.countdown(lastDay, {elapse: true})
            .on('update.countdown', function (event) {
            if (event.elapsed) {
               //$id.html('');
            } else {
                var totalHours = event.offset.totalDays * 24 + event.offset.hours;
               $id.html( event.strftime(totalHours+' '+selectorCurent.find('.hr').text()+' %M '+selectorCurent.find('.min').text() ) );
             }
            });
         }

         selectorCurent.show();
    };

    geckoShopify.getCookie = function (cname) {
       var name = cname + "=";
       var decodedCookie = decodeURIComponent(document.cookie);
       var ca = decodedCookie.split(';');
       for(var i = 0; i <ca.length; i++) {
         var c = ca[i];
         while (c.charAt(0) == ' ') {
           c = c.substring(1);
         }
         if (c.indexOf(name) == 0) {
           return c.substring(name.length, c.length);
         }
       }
       return "";
    };

    // geckoShopify.intThe4IP = function (id) {
    //   var $id = $(id);
    //   if ($id.length == 0) return;
    //   var dataShip = $id.data('ship'),
    //       userCountry = geckoShopify.getCookie('_shopify_country').replace(/\+/g," ") || 'T4NT';

    //   var dataUpdate = function (data) {
    //      var countryName = data.country,
    //          currencyCode = data.currency;
    //          //console.log('currencyCode: '+geckoTheme.url_currency)
    //         $id.find('.country_user').addClass('flagst4-'+currencyCode).text(countryName);
    //      //console.log(dataShip)
    //      if ( dataShip.includes(userCountry) ) {
    //         $('.has_ship').show(); $('.no_ship').hide();
    //      } else {
    //         $('.no_ship').show(); $('.has_ship').hide();
    //      }
    //   };

    //   if (nt_currency) {
    //      var data = JSON.parse(nt_currency);
    //      dataUpdate(data);
    //      $id.show();
    //   } else {
    //      $.ajax({
    //         type: 'get',
    //         url: geckoTheme.url_currency,
    //         dataType: "json",
    //         success: function (data) {
    //            dataUpdate(data);
    //            $id.show();
    //            if (sp_nt_storage) { localStorage.setItem('nt_currency', JSON.stringify(data)) }
    //         }
    //      });
    //   }
    // };

    geckoShopify.PrRecommendations = function (sl) {

      var _this = sl || $('#pr_recommendations');
      if ( _this.length == 0 ) return;

      var id = _this.data('id'),
         limit = _this.data('limit'),
         type = _this.data('type'),
         baseUrl = _this.data('baseurl');

         var sendTrekkieEvent = function() {
           if (!window.ShopifyAnalytics || !window.ShopifyAnalytics.lib || !window.ShopifyAnalytics.lib.track ) {
             return;
           }
           var didPageJumpOccur = _this[0].getBoundingClientRect().top <= window.innerHeight,
               numberOfRecommendationsDisplayed = limit;

           window.ShopifyAnalytics.lib.track('Product Recommendations Displayed', {
             theme: 'Kalles',
             didPageJumpOccur: didPageJumpOccur,
             numberOfRecommendationsDisplayed: numberOfRecommendationsDisplayed
           });
         };
         //console.log(baseUrl);
         if (type == '3') {
           var url = baseUrl+'?section_id=product-recommendations&product_id='+id+'&limit='+limit;
         } else {
           var url = baseUrl+'&section_id=product-recommendations';
         }
         //console.log(url);

         $.ajax({
            url: url,
            dataType: 'html',
            type: 'GET',
            success: function (section) {
              var recommendationsMarkup = $(section).html();
              //console.log(recommendationsMarkup)
              if (recommendationsMarkup.trim() !== '') {
                _this.html(recommendationsMarkup);

               var seat = _this.find('.pr_animated:not(.done)');
               geckoShopify.class_sequentially(seat);

               var $this = _this.find('.nt_products_holder');
               geckoShopify.refresh_flickity($this);
               geckoShopify.flickityResposition(false,$this);
               geckoShopify.recalculateSwatches();
               
               geckoShopify.InitCountdown();
               body.trigger('refresh_currency');
               if (type == '3') {sendTrekkieEvent()}
               geckoShopify.review();
           geckoShopify.lazyWishUpdate();
              } else {
                _this.slideUp();
              }
            },
           error: function() {
              _this.hide();
           },
           complete: function() {}
         });
    };

    geckoShopify.recently_viewed = function (sl) {

      var el = sl || $('#recently_wrap');
      if (!sp_nt_storage || el.length == 0 ) return;

      var ls = localStorage.getItem('nt_recent'),
          id = (t_name == "product") ? el.data('id') : '19041994',
          get = el.data('get'),
          unpr = el.data('unpr'), 
          limit = el.data('limit');

      if (ls != null) { 
         var arrls = ls.split(','),
         index = arrls.indexOf(id);

         //if( arrls.length > limit ) { arrls = arrls.splice(0,limit+1) }
         if (index > -1) { 
            arrls = arrls.splice(0,limit+1); 
            arrls.splice(index, 1); 
         } else {
            arrls = arrls.splice(0,limit);
         }
         // console.log(index);
         // console.log(arrls);

         if(arrls.length == 0) {
          el.slideUp();
          return false;
         }

         var arr_list = arrls.toString(),
            uri = arr_list.replace(/,/g, ' OR '),
            res = encodeURI(uri);
            //console.log(res);

            $.ajax({
              url: get+'?view=nathan&type=product&options[unavailable_products]='+unpr+'&q='+res,
              dataType: 'html',
              type: 'GET',
              success: function(section) {
               var recentlyMarkup = (designMode) ? $($(section)[2]).html() : $(section).html();
               try {
                  recentlyMarkup.trim()
                }
                catch(err) {
                  recentlyMarkup = $(section).html()
                }
               if (recentlyMarkup.trim() !== '') {
                  //console.log(responsive);
                  el.html(recentlyMarkup);

                  var seat = el.find('.pr_animated:not(.done)');
                  geckoShopify.class_sequentially(seat);

                  var $this = el.find('.nt_products_holder');
                  geckoShopify.refresh_flickity($this);
                  geckoShopify.flickityResposition(false,$this);
                  geckoShopify.recalculateSwatches();

                  geckoShopify.InitCountdown();
                 //currency
                 body.trigger('refresh_currency');
                 //product review
                 geckoShopify.review();
                 //
            geckoShopify.lazyWishUpdate();
               }
              },
              error: function() {
              _this.hide();
              },
              complete: function() {}
            }); 

      } else {
        el.html('');
        var arrls = new Array();

      }

      if ( arrls.indexOf(id) < 0 && id != '19041994' ) {
         //if(arrls.length > limit){ arrls.pop(); }
         if ( arrls.length > limit){ arrls = arrls.splice(0,limit) }
         // console.log(arrls);
         arrls.unshift(id);
         localStorage.setItem('nt_recent', arrls.toString());
      }
    };

    geckoShopify.clickProduct = function () {
        if (!$('body').hasClass('template-product')) return;

        $(".rating_sp_kl, .readm_sp_kl").click(function(e){
           e.preventDefault();
           if ( $(this).hasClass( "rating_sp_kl" ) ) {
            var id = '#tab_pr_reivew';
           } else {
            var id = '#tab_pr_deskl';
           }
           // var anchor = $(this);
           $(".ul_tabs a[href='"+id+"']:visible").trigger("click");
           $(id+":not(.active) .tab-heading:visible").trigger("click");
           // setTimeout(function () {
           //    window.scrollTo(0, 0);
           // }, 1);
           // setTimeout(function () {
           //    $('html, body').stop().animate({
           //       scrollTop: $('#tab_pr_reivew').offset().top - 100
           //    }, 400);
           // }, 10);
           $('html, body').stop().animate({
              scrollTop: $(id).offset().top - 100
           }, 400);
        });

        $(".ul_tabs>.tab_title_block>a").click(function(e){
           e.preventDefault();
           var _this = $(this),
               parent = _this.closest('.sp-tabs');
           
           parent.find(".tab_title_block").removeClass("active");
           _this.closest("li").addClass("active").addClass("active");
           parent.find('.sp-tab.panel').hide().removeClass("active");
           parent.find(_this.attr("href")).show().addClass("active");
        });
    };

    // Init product accordion
    geckoShopify.spAccordion =  function () {

      if ( $('.sp-tabs .tab-heading').length == 0 ) return;
      
      //$('.sp-tabs .tab-heading').click(function (e) {
        //$(document).on('click', '.nt_gallery_item a', function (e) {
      $(document).on('click', '.sp-tabs .tab-heading', function(e) {
         e.preventDefault();

         var _this = $(this),
            parent = _this.closest('.sp-tab'),
            parent_top = _this.closest('.sp-tabs'),
            el = _this.closest('.nt_section'),
            time = 300,
            time2 = time+50;
            
            if ( el.length == 0) {
              el = _this.closest('.shopify-section')
            }
            //console.log(el);
         parent.addClass('clicked_accordion')
         if (parent.hasClass('active')) {
            parent.removeClass('active');
            parent.find('.sp-tab-content').slideUp(time);
         } else {

           // var h = el.height(),
           //     o = el.offset().top;

            parent_top.find('.sp-tab').removeClass('active');
            parent.addClass('active');
            //parent_top.find('.sp-tab-content').stop(true, true).slideUp(time);
            parent_top.find('.sp-tab-content').slideUp(150);
            parent.find('.sp-tab-content').stop(true, true).slideDown(time);
            
            // console.log(el);
            // console.log(h);
            // console.log(o);
            //console.log(geckoShopify.isVisible(el_active,true));

            
            //window.scrollTo(0, o);
           
            setTimeout(function(){
                parent.find('.sp-tab-content .js_packery').packery('layout'); 
                 //console.log(parent.index())

                var el_active = parent_top.find('.sp-tab.active .js_ck_view');
                if ( geckoShopify.isVisible(el_active,true) ) {
                  //parent.find('.sp-tab-content').stop(true, true).slideDown(time);
                  return;
                } 
                //el.find(".sp-tab.active").ScrollTo();

                var num_height = $('.ntheader.live_stuck .sp_header_mid').height() || 0,
                 of_active = el.find(".sp-tab.active").offset().top - num_height;
               //  //window.scrollTo(0, of_active);
               // window.scrollTo({
               //   top: of_active,
               //   left: 0,
               //   behavior: 'smooth'
               // });
               $('body,html').animate({ scrollTop: of_active });
            }, 200);
            
         }
      });
    };

    geckoShopify.cartLazyUp = function () {
        if ( body.hasClass('template-cart')) return;

      $('.js_cat_items').addClass('lazyload').on('lazyincludeloaded', function(e) {
        if (e.detail.content) {
          var arrCat = e.detail.content.split("[split_t4nt]");
          e.detail.content = arrCat[0];
          
          try {
            var aar1 = arrCat[1].split(',]');
          }
          catch(err) {
            return false;
          }
          if (aar1 != 'spt4' && $('.cart_thres_js').length > 0) {
            $('.cart_thres_1,.cart_thres_2,.cart_thres_3').slideUp(150);;
              $('.cart_thres_'+aar1[0]).slideDown(150);
              //console.log(arrCat[1])
              UpdateShipBar(arrCat[1],aar1[1],$('.cart_thres_'+aar1[0]));
              $('.cart_thres_js').removeClass('op__0');
          }
          var aar2 = arrCat[2].split(',]');
          if (aar2[0] != 'spt4' && $('.mini_cart_gift').length > 0) {
            $('.mini_cart_gift .js_addtc').attr('data-id',aar2[0]);
            $('.mini_cart_gift .gift_wrap_text').append(aar2[1]);
          }
          //console.log(aar2[0])
          if (arrCat[3] == '1' || aar2[0] == 'spt4') {
               $('.js_gift_wrap').addClass('dn');
          } else {
               $('.js_gift_wrap').removeClass('dn');
          }
          // body.trigger('refresh_currency'); 
        }

      }).on('lazyincluded', function(e) {
        // console.log('asdads')
         miniCartUpsell(19041994);
        body.trigger('refresh_currency'); 
      });
    };

   function searchURL(url) {
    // type=product&options%5Bunavailable_products%5D=last&options%5Bprefix%5D=none&product_type=*&q=a
    //console.log(url);
    try{
      var arr = url.split('&product_type='),
      arr_q = arr[1].split('&q=');
      return arr[0]+'&q='+arr_q[1]+search_prefix+'+product_type:'+arr_q[0];
    } catch(e){
      return url+search_prefix;
    }
     // var arr = url.split('&product_type='),
     //  arr_q = arr[1].split('&q=');
      // if(arr[0].indexOf('type=product&') == -1){
     //     var arr0 = 'type=product&'+arr[0];
     //   } else {
     //     var arr0 = arr[0];
     //   }
     //  if(url.indexOf('&product_type=*') != -1){
      // return url.replace('type=product&','').replace('&product_type=*','');
     //  } else {
      // return arr[0]+'&q='+arr_q[1]+'+product_type:'+arr_q[0];
     //  }
    // return arr[0]+'&q='+arr_q[1]+'+product_type:'+arr_q[0];
     // if (body.hasClass('js_search_type')) {
     //   return arr[0]+'&q='+arr_q[1]+'*+product_type:'+arr_q[0];
     // } else {
     //   return arr[0]+'&q='+arr_q[1]+'*'+arr_q[0];
     // }
   };

   geckoShopify.searchType = function () {
    //if (!body.hasClass('js_search_type')) return;
       
      body.on('click', '.js_btn_search', function(e) {
         e.preventDefault();
         //console.log('aaa')
         var _frm = $(this).closest("form");
         location.href = _frm.attr('action')+'?'+searchURL(_frm.serialize());
      });
      
   };
   
   // Show More Less
   geckoShopify.CatHeader8 = function (el) {

      var $element = $(el);
      if ($element.length == 0) return;
         var $window = $(window), 
         windowHeight = $window.height(), 
         offsetTop = $element.offset().top; 
         //offsetTop < windowHeight && (fullHeight = 100 - offsetTop / (windowHeight / 100), $element.css("min-height", fullHeight + "vh"))
         if (offsetTop < windowHeight) {
           var fullHeight = 100 - (offsetTop + 40) / (windowHeight / 100);
           $element.addClass('mh_js_cat').css("max-height", fullHeight + "vh");
         }
   };

   geckoShopify.searchAjax = function () {

      $ntSearch.addClass('lazyload').one('lazyincluded', function(e) {
         //console.log('search ajax')
        body.trigger('refresh_currency');
        // if ($('#nt_search_canvas').hasClass('nt_fk_full') && $(window).width() > 1024) {
        //     slug_js = '&view=js'
        // } else { 
        //     slug_js = '&view=js';
        // }
        val_old = '';
        // $('.js_iput_search').val(val_currect).trigger('keyup',1);
      });  
      
     if (body.hasClass('js_search_false')) return;

      var slug_js = '&view=js', timer = 0, data,_this,frm,btn,$result,ld_bar,skeleto,val_old,val_currect,_frmParent;
      body.on('keyup', '.js_iput_search', function(e,bl) {
          _this = $(this);
          frm = _this.closest("form");
          btn = frm.find('.js_btn_search');
         _this.attr('autocomplete', 'off');
         _frmParent = frm.parent();
         $result = _frmParent.find('.js_prs_search');
         ld_bar = $('.ld_bar_search');
         skeleto = $('.skeleton_js');
         val_currect = _this.val();
         
         // console.log(bl);
         // console.log(val_old);
         // console.log(val_currect);
         // if ( (val_old == val_currect && bl != '1') || val_currect == "" ) return;
         // if ( (val_old == val_currect && bl != '1') || (val_currect == "" && bl != '1') ) return;

         if ( (val_old == val_currect || val_currect == "") && bl != '1' ) return;
        ld_bar.addClass('on_star');
        $result.hide();
        skeleto.removeClass('dn');
        btn.addClass('pe_none');
        _frmParent.addClass('atc_opended_rs atc_show_rs');

        if (btn.hasClass('use_jsSe')) 
            slug_js = '&view=jsSe'
        else if (btn.hasClass('use_jsfull') && $(window).width() > 1024)
            slug_js = '&view=jsfull'
        else
            slug_js = '&view=js';

         clearTimeout(timer);
        timer = setTimeout(function () {
           // console.log(_this)
           // console.log(frm)
           //ld_bar.addClass('on_star');
           // if (body.hasClass('js_search_type')) {
           //   data = searchURL(frm.serialize());
           // } else {
           //   data = frm.serialize();
           // }
           data = searchURL(frm.serialize());
           //console.log(frm.attr('action')
        $.ajax({
          url: frm.attr('action'), 
          data : data+slug_js,
          success: function(result){
            var arr = result.split('||')
             $('.search_header__prs>span').hide();
             $('.search_header__prs,.search_header__content').show();
             //console.log(arr[0]);
             $(arr[0]).show();
              $result.html(arr[1]);
              val_old = val_currect;
              body.trigger('refresh_currency');
           },
          error: function(xhr,status,error){
            console.log(error)
           },
          complete: function(){
            //_frmParent.addClass('atc_opended_rs');
            btn.removeClass('pe_none');
            ld_bar.addClass('on_end');
             setTimeout(function(){ 
                ld_bar.attr('class', '').addClass('ld_bar_search');
                skeleto.addClass('dn');
                $result.show();
             }, 280);
           }
        });
      }, 400);

      });

      body.on('click', function (e) {
        var target = e.target,
            _target = $(target),
            _targetParents = _target.parents();
        if (!_target.is('.cl_h_search') && !_targetParents.is('.cl_h_search') && !_targetParents.is('.js_h_search')) {
            //$('.atc_show_rs,.atc_opended_rs').removeClass('atc_show_rs atc_opended_rs');
            $('.atc_show_rs').removeClass('atc_show_rs');
            val_old = '';
        }
        if (!_targetParents.is('.search-overlap')) {
          $('body').removeClass('hsearch-dropdown-opened');
        }
      });

      $ntSearch.on('change', 'select', function() { 
        $('#nt_search_canvas .js_iput_search').trigger('keyup',1);
      });

      $('.h_search_frm').on('change', 'select', function() { 
        $('.h_search_frm .js_iput_search').trigger('keyup',1);
      });    
   };

   

   geckoShopify.searchDropdown = function () {

      if (!body.hasClass('search_pos_dropdown') || body.hasClass('des_header_7') || window_w < 1025) return;

      body.addClass('Search_dropdown_prepared');
      var _id = '#nt_search_canvas',
          _sp = '#shopify-section-',
          searchWrapper = $(_id),
          offset = 0,
          space = ( body.hasClass('rtl_true') ) ? 60 : 250;

      body.on('click', '.push_side[data-id="'+_id+'"]', function (e) {

        e.preventDefault();
        var offsetPos = $(this).offset();
        //console.log('ASA nt_search_canvas')
        //if ($(this).parent().find('.woodmart-search-dropdown').length > 0) return; // if dropdown search on header builder
        

        if (isOpened()) {
          closeWidget();
        } else {
          setTimeout(function () {
            openWidget(offsetPos);
          }, 10);
        }

      });

      var closeByEsc = function (e) {
        if (e.keyCode === 27) {
          closeWidget();
          body.unbind('keyup', closeByEsc);
        }
      };

      var closeWidget = function () {
        searchWrapper.removeClass('search-overlap');
        //$('.mask_opened').trigger('click');
        $('body').removeClass('hsearch-dropdown-opened');
      };

      var openWidget = function (offsetPos) {
         //console.log(searchWrapper)

        var offset = 0,
            h_se = $('.css_h_se').outerHeight() || $('.header__mid').outerHeight();

        if ($('.live_stuck').length > 0) {
            offset = h_se;
        } else {
          offset = h_se;
          if ($(_sp+'header_banner').length > 0) {
            offset += $(_sp+'header_banner').outerHeight();
          }
          if ($(_sp+'header_top').length > 0) {
            offset += $(_sp+'header_top').outerHeight();
          }
        }

        var top = offset - 2, //top = offsetPos.top + 30,
           left = offsetPos.left - space;
        //console.log(top,left)
        searchWrapper.css({
           'top' : top+'px',
           'left' : left+'px'
        });
        // searchWrapper.css('top', offset - 5);

        // Close by esc
        body.on('keyup', closeByEsc);

        $('body').addClass('hsearch-dropdown-opened');
        searchWrapper.addClass('search-overlap').on('transitionend webkitTransitionEnd oTransitionEnd', function () {
          searchWrapper.find('input[type="text"]').focus();
          $(window).one('scroll', function () {
            if (isOpened()) {
              closeWidget();
            }
          });
        });
        // searchWrapper.addClass('search-overlap');
        // setTimeout(function () {
        //   searchWrapper.find('input[type="text"]').focus();
        //   $(window).one('scroll', function () {
        //     if (isOpened()) {
        //       closeWidget();
        //     }
        //   });
        // }, 300);
      };

      var isOpened = function () {
        return $('body').hasClass('hsearch-dropdown-opened');
      };
   };

    function _ToggleDragging(flkty,bl) {
      if (flkty.options.draggable == bl) {
        return;
      }
      
      flkty.options.draggable = bl;
      flkty.updateDraggable();
    };

   geckoShopify.LibraryLoader = function () {

      // plyr/v2.0/shopify-plyr.css
      // shopify-plyr/v1.0/shopify-plyr.css
      var types = {
        link: 'link',
        script: 'script'
      };

      var status = {
        requested: 'requested',
        loaded: 'loaded'
      };

      var cloudCdn = 'https://cdn.shopify.com/shopifycloud/';

      var libraries = {
        youtubeSdk: {
          tagId: 'youtube-sdk',
          src: 'https://www.youtube.com/iframe_api',
          type: types.script
        },
        vimeoSdk: {
          tagId: 'vimeo-sdk',
          src: 'https://player.vimeo.com/api/player.js',
          type: types.script
        },
        plyrShopifyStyles: {
          tagId: 'plyr-shopify-styles',
          src: cloudCdn + 'plyr/v2.0/shopify-plyr.css',
          type: types.link
        },
        modelViewerUiStyles: {
          tagId: 'shopify-model-viewer-ui-styles',
          src: cloudCdn + 'model-viewer-ui/assets/v1.0/model-viewer-ui.css',
          type: types.link
        }
      };

      function load(libraryName, callback) {
        var library = libraries[libraryName];

        if (!library) return;
        if (library.status === status.requested) return;

        callback = callback || function() {};
        if (library.status === status.loaded) {
          callback();
          return;
        }

        library.status = status.requested;

        var tag;

        switch (library.type) {
          case types.script:
            tag = createScriptTag(library, callback);
            break;
          case types.link:
            tag = createLinkTag(library, callback);
            break;
        }

        tag.id = library.tagId;
        library.element = tag;

        var firstScriptTag = document.getElementsByTagName(library.type)[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      function createScriptTag(library, callback) {
        var tag = document.createElement('script');
        tag.src = library.src;
        tag.addEventListener('load', function() {
          library.status = status.loaded;
          callback();
        });
        return tag;
      }

      function createLinkTag(library, callback) {
        var tag = document.createElement('link');
        tag.href = library.src;
        tag.rel = 'stylesheet';
        tag.type = 'text/css';
        tag.addEventListener('load', function() {
          library.status = status.loaded;
          callback();
        });
        return tag;
      }

      return {
        load: load
      };
   };
   //geckoShopify.LibraryLoader().load('plyrShopifyStyles');
  
  geckoShopify.ProductVideo = function () {
    //var videos = {};

    var hosts = {
      html5: 'html5',
      youtube: 'youtube',
      vimeo: 'vimeo'
    };

    var selectors = {
      productMediaWrapper: '[data-pr-md-tp-video]'
    };

    var attributes = {
      enableVideoLooping: 'looping',
      videoId: 'video-id'
    };

    function init(videoContainer, sectionId) {
      // console.log(videoContainer.length);
      if (!videoContainer.length) {
        return;
      }

      var videoElement = videoContainer.find('iframe, video')[0];
      var mediaId = videoContainer.data('mediaId');
        
        // console.log(mediaId);
      if (!videoElement) {
        return;
      }

      videos[mediaId] = {
        mediaId: mediaId,
        sectionId: sectionId,
        host: hostFromVideoElement(videoElement),
        container: videoContainer,
        element: videoElement,
        ready: function() {
          //console.log('createPlayer');
          createPlayer(this);
        }
      };
          
      var video = videos[mediaId];
        
      switch (video.host) {
        case hosts.html5:
          window.Shopify.loadFeatures([
            {
              name: 'video-ui',
              version: '1.0',
              onLoad: setupPlyrVideos
            }
          ]);
          geckoShopify.LibraryLoader().load('plyrShopifyStyles');
          //theme.LibraryLoader.load('plyrShopifyStyles');
          break;
        case hosts.youtube:
          geckoShopify.LibraryLoader().load('youtubeSdk', setupYouTubeVideos);
          //theme.LibraryLoader.load('youtubeSdk', setupYouTubeVideos);
          break;
        case hosts.vimeo:
          //console.log('vimeo')
          geckoShopify.LibraryLoader().load('vimeoSdk', setupVimeoVideos);
          break;
      }
    }

    function setupPlyrVideos(errors) {
      if (errors) {
        fallbackToNativeVideo();
        return;
      }

      loadVideos(hosts.html5);
    }

    function setupYouTubeVideos() {
      //console.log('setupYouTubeVideos');
      if (!window.YT.Player) return;
      loadVideos(hosts.youtube);
    }

    function setupVimeoVideos() {
      //console.log('setupYouTubeVideos');
      if (!window.Vimeo) return;
      loadVideos(hosts.vimeo);
    }

    function createPlayer(video) {
       // console.log('2222');
       // console.log(video.player);
      //console.log(video);
      if (video.player) {
        return;
      }

      var productMediaWrapper = video.container.closest(
        selectors.productMediaWrapper
      );
      //console.log(productMediaWrapper);
      var enableLooping = productMediaWrapper.data(attributes.enableVideoLooping);
      //console.log(enableLooping);

        var $carousel = video.container.closest('.p-thumb');
        var ck_flkty = true;
        if ($carousel.hasClass('is-draggable')) {
          ck_flkty = false;
          var flkty = $carousel.data('flickity');
        }
        
      switch (video.host) {
        case hosts.html5:
          // eslint-disable-next-line no-undef
          // video.player = new Shopify.Plyr(video.element, {
          //   loop: { active: enableLooping }
          // });
          video.player = new Shopify.Plyr(video.element, {
            controls: ['play', 'progress', 'mute', 'volume', 'play-large', 'fullscreen'],
            loop: { active: enableLooping },
            hideControlsOnPause: true,
            clickToPlay: true,
            iconUrl: '//cdn.shopify.com/shopifycloud/shopify-plyr/v1.0/shopify-plyr.svg',
            tooltips: {
              controls: false,
              seek: true
            }
          });
          
          if (ck_flkty) break;
          video.player.on('play', function () {
            // fix error when product grouped varriant image
            flkty = video.container.closest('.p-thumb').data('flickity')
            // Disable draggability
            _ToggleDragging(flkty,false);
          });
          video.player.on('pause', function () {
            // Enable draggability
            _ToggleDragging(flkty,">1");
          });
          break;

        case hosts.youtube:
          if (window.YT == undefined || window.YT.Player == undefined) return;
          
          var videoId = productMediaWrapper.data(attributes.videoId);
          video.player = new YT.Player(video.element, {
            videoId: videoId,
            events: {
              onStateChange: function(event) {

                if (event.data === 0 && enableLooping) event.target.seekTo(0);

                // if (ck_flkty) return;
                // if (event.data === window.YT.PlayerState.PLAYING) {
                //   // Disable draggability
                //   _ToggleDragging(flkty,false);
                // } else if (event.data === YT.PlayerState.PAUSED) {
                //   // Enable draggability
                //   _ToggleDragging(flkty,">1");
                // }

              }
            }
          });
          break;

        case hosts.vimeo:
          // https://developer.vimeo.com/player/sdk/reference#set-the-loop-state-of-a-player
          if (window.Vimeo == undefined || window.Vimeo.Player == undefined) return;

          var videoId = productMediaWrapper.data(attributes.videoId);
          video.player = new Vimeo.Player(video.element, {
            id: videoId,
            autoplay: false,
            //muted: true,
            background: true
             /*height: '100%',
             width: '100%',*/
            //loop: enableLooping
          });
          if (enableLooping && video.player.setLoop) {
            video.player.setLoop(enableLooping)
          }
          break;
      }

      productMediaWrapper.on('mediaHidden xrLaunch', function() {
        if (!video.player) return;
          
        if (video.host === hosts.html5) {
          video.player.pause();
        }

        if (video.host === hosts.youtube && video.player.pauseVideo) {
          video.player.pauseVideo();
        }

        if (video.host === hosts.vimeo && video.player.pause) {
          video.player.pause();
        }
      });

      productMediaWrapper.on('mediaVisible', function() {

        //if (theme.Helpers.isTouch()) return;
        // As per guidelines, we only need to autoplay when it's not a touch device, and on desktop only if it's not the initial loading
        if (Modernizr.touchevents) return;
        //console.log(video);
        if (!video.player) return;

        if (video.host === hosts.html5) {
          video.player.play();
        }

        if (video.host === hosts.youtube && video.player.playVideo) {
          video.player.playVideo();
        }

        if (video.host === hosts.vimeo && video.player.play) {
          video.player.play();
        }
      });
    }

    function hostFromVideoElement(video) {
      if (video.tagName === 'VIDEO') {
        return hosts.html5;
      }

      if (video.tagName === 'IFRAME') {
        if (
          /^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(
            video.src
          )
        ) {
          return hosts.youtube;
        }
        else if (
          /^(https?:\/\/)?(player\.)?(vimeo\.com)\/.+$/.test(
            video.src
          )
        ) {
          return hosts.vimeo;
        }
      }
      return null;
    }

    function loadVideos(host) {
      //console.log(host);
      //console.log(videos);
      for (var key in videos) {
        if (videos.hasOwnProperty(key)) {
          var video = videos[key];
          if (video.host === host) {
            video.ready();
          }
        }
      }
    }

    function fallbackToNativeVideo() {
      for (var key in videos) {
        if (videos.hasOwnProperty(key)) {
          var video = videos[key];

          if (video.nativeVideo) continue;

          if (video.host === hosts.html5) {
            video.element.setAttribute('controls', 'controls');
            video.nativeVideo = true;
          }
        }
      }
    }

    function removeSectionVideos(sectionId) {
      for (var key in videos) {
        if (videos.hasOwnProperty(key)) {
          var video = videos[key];

          if (video.sectionId === sectionId) {
            if (video.player) video.player.destroy();
            delete videos[key];
          }
        }
      }
    }

    return {
      init: init,
      hosts: hosts,
      loadVideos: loadVideos,
      removeSectionVideos: removeSectionVideos
    };
  };
  
  geckoShopify.ProductModel = function () {
      // var modelJsonSections = {};
      // var models = {};
      // var xrButtons = {};

      var selectors = {
        mediaGroup: '[data-pr-single-media-group]',
        xrButton: '[data-shopify-xr]'
      };

      function init(modelViewerContainers, sectionId) {
        modelJsonSections[sectionId] = {
          loaded: false
        };

        modelViewerContainers.each(function(index) {
          var $modelViewerContainer = $(this);
          var mediaId = $modelViewerContainer.data('media-id');
          var $modelViewerElement = $(
            $modelViewerContainer.find('model-viewer')[0]
          );
          //console.log('$modelViewerContainer',$modelViewerElement[0])
          var modelId = $modelViewerElement.data('model-id');

          if (index === 0) {
            var $xrButton = $modelViewerContainer
              .closest(selectors.mediaGroup)
              .find(selectors.xrButton);
            xrButtons[sectionId] = {
              $element: $xrButton,
              defaultId: modelId
            };
          }

          models[mediaId] = {
            modelId: modelId,
            sectionId: sectionId,
            $container: $modelViewerContainer,
            $element: $modelViewerElement[0]
          };
          // $element: $modelViewerElement
        });

        window.Shopify.loadFeatures([
          {
            name: 'shopify-xr',
            version: '1.0',
            onLoad: setupShopifyXr
          },
          {
            name: 'model-viewer-ui',
            version: '1.0',
            onLoad: setupModelViewerUi
          }
        ]);
        geckoShopify.LibraryLoader().load('modelViewerUiStyles');
        //theme.LibraryLoader.load('modelViewerUiStyles');
      }

      function setupShopifyXr(errors) {
        if (errors) return;

        if (!window.ShopifyXR) {
          document.addEventListener('shopify_xr_initialized', function() {
            setupShopifyXr();
          });
          return;
        }

        for (var sectionId in modelJsonSections) {
          if (modelJsonSections.hasOwnProperty(sectionId)) {
            var modelSection = modelJsonSections[sectionId];

            if (modelSection.loaded) continue;
            var $modelJson = $('#ModelJson-' + sectionId);

            window.ShopifyXR.addModels(JSON.parse($modelJson.html()));
            modelSection.loaded = true;
          }
        }
        window.ShopifyXR.setupXRElements();
      }

      function setupModelViewerUi(errors) {
        if (errors) return;

        for (var key in models) {
          if (models.hasOwnProperty(key)) {
            var model = models[key];
            if (!model.modelViewerUi) {
              model.modelViewerUi = new Shopify.ModelViewerUI(model.$element);
            }
            //console.log(model);
            setupModelViewerListeners(model);
          }
        }
      }

      function setupModelViewerListeners(model) {
        var xrButton = xrButtons[model.sectionId];
        // console.log(model);
        // console.log(model.$container);
        // console.log(xrButtons);
        // console.log(xrButton);
        // console.log(xrButton.$element);

        model.$container.on('mediaVisible', function() {
          xrButton.$element.attr('data-shopify-model3d-id', model.modelId);
          //if (theme.Helpers.isTouch()) return;
          if (Modernizr.touchevents) return;
          model.modelViewerUi.play();
        });

        model.$container
          .on('mediaHidden', function() {
            xrButton.$element.attr('data-shopify-model3d-id', xrButton.defaultId);
            model.modelViewerUi.pause();
          })
          .on('xrLaunch', function() {
            model.modelViewerUi.pause();
          });
        
          var $carousel = model.$container.closest('.p-thumb');
          if (!$carousel.hasClass('is-draggable')) return;
          var flkty = $carousel.data('flickity');
          //model.$element.addEventListener
          $(model.$element).on('shopify_model_viewer_ui_toggle_play', function() {
            // fix error when product grouped varriant image
            flkty = video.container.closest('.p-thumb').data('flickity')
            // Disable draggability
            _ToggleDragging(flkty,false)

          });

          $(model.$element).on('shopify_model_viewer_ui_toggle_pause', function() {
            // Enable draggability
            _ToggleDragging(flkty,">1")

          });
      }

      function removeSectionModels(sectionId) {
        for (var key in models) {
          if (models.hasOwnProperty(key)) {
            var model = models[key];
            if (model.sectionId === sectionId) {
              models[key].modelViewerUi.destroy();
              delete models[key];
            }
          }
        }
        delete modelJsonSections[sectionId];
      }

      return {
        init: init,
        removeSectionModels: removeSectionModels
      };
  };

  geckoShopify.initProductVideo = function(sectionId) {
    if ($(productMediaTypeVideo).length == 0 ) return;
    // var sectionId = '19041994',
    //     $container = $('.product-images');
    var $container = $('[data-featured-product-se][data-id="'+sectionId+'"] .product-images');
    
    //$(productMediaTypeVideo, $container).each(function() {
    $(productMediaTypeVideo).each(function() {
      var $el = $(this);
      //console.log($el);
      geckoShopify.ProductVideo().init($el, sectionId);
    });
  };

  geckoShopify.initModelViewerLibraries = function(sectionId) {

    if ($(productMediaTypeModel).length == 0 ) return;
    // var sectionId = '19041994',
    //     $container = $('.product-images');
    var $container = $('[data-featured-product-se][data-id="'+sectionId+'"] .product-images');
    //console.log('$container productMediaTypeModel', $container)
 
    var $modelViewerElements = $(
      productMediaTypeModel,
      $container
    );
    if ($modelViewerElements.length < 1) return;
    geckoShopify.ProductModel().init($modelViewerElements, sectionId);
    //theme.ProductModel.init($modelViewerElements, this.settings.sectionId);
  };

  geckoShopify.initShopifyXrLaunch = function(sectionId) {
    //var self = this;

    if ($(productMediaTypeModel).length == 0 ) return;
    $(document).on('shopify_xr_launch', function() {
      //alert('aasd');
      // var $currentMedia = $(
      //   self.selectors.productMediaWrapper +
      //     ':not(.' +
      //     self.classes.hidden +
      //     ')',
      //   self.$container
      // );
      // $currentMedia.trigger('xrLaunch');

      //$('[data-mdtype="model"].is-selected').trigger('xrLaunch');
      $('[data-featured-product-se][data-id="'+sectionId+'"] [data-mdtype="model"].is-selected').trigger('xrLaunch');

    });
  };

  geckoShopify.ThumLeftRight = function (id) {
    if (window_w < 1024 || ($('[data-featured-product-se][data-id="'+id+'"] .thumb_left').length == 0 && $('[data-featured-product-se][data-id="'+id+'"] .thumb_right').length == 0)) return;

    // var $carouselNav = (id == undefined) ? $('.p-nav') : $('[data-featured-product-se][data-id="'+id+'"] .p-nav');
    // console.log('ThumLeftRight id',id)
    // if ($carouselNav.length == 0) return;

    var $carouselNav = (id == undefined) ? $('.p-nav') : $('[data-featured-product-se][data-id="'+id+'"] .p-nav');
    var $col_nav = (id == undefined) ? $('.col_nav') : $('[data-featured-product-se][data-id="'+id+'"] .col_nav');
    
    //console.log('ThumLeftRight',$carouselNav);
    // var $carouselNav = $('.p-nav'),
    //     $col_nav = $('.col_nav'),
    //     timer = 400;
    var timer = 400,
        btn_pnav_next = $col_nav.find('.btn_pnav_next'),
        btn_pnav_prev = $col_nav.find('.btn_pnav_prev');

    $carouselNav.on( 'select.flickity', function(event, index) {
        //console.log('select.flickity');
        $col_nav.removeClass('t4_show');

        if ($(window).width() <= 1024) return;
      var slider_height = $carouselNav.find('.flickity-slider').height(),
          navHeight = $carouselNav.height(),
          navCellHeight = slider_height/$carouselNav.find('.n-item').length;
      // console.log(slider_height);
      // console.log(navHeight);
      //console.log(navCellHeight)

      if ( slider_height <= navHeight) return;

      //btn_pnav_prev.attr('disabled','disabled');

      if (slider_height - navHeight > 45 ) {
         $col_nav.addClass('t4_show');
      }
  
      // scroll nav
      var mdid = $('.p-thumb .is-selected').attr('data-mdid');
      var $selected = $carouselNav.find('.flickity-slider .n-item[data-mdid="'+mdid+'"]'),
          //$selected = $carouselNav.find('.flickity-slider .n-item').eq( index ),
          scrollY = $selected.position().top + $carouselNav.position().top - ( navHeight + navCellHeight ) / 2;
          //scrollY = $selected.position().top + $carouselNav.offset().top - ( navHeight + navCellHeight ) / 2
          //scrollY = $selected.position().top + $carouselNav.scrollTop() - ( navHeight + navCellHeight ) / 2;

      // console.log('$selected: ', index,$selected);
      // console.log('selected position top: ',$selected.position().top);
      // console.log('carouselNav position top: ', $carouselNav.position().top);
      // console.log('scrollY: ',scrollY);

      // $carouselNav.animate({
      //   scrollTop:scrollY
      // }); 
        $carouselNav.stop().animate({
            scrollTop: scrollY
        }, timer);
      
    });
    
  //   $carouselNav.on( 'scroll.flickity', function( event, progress ) {
    //  console.log('scroll.flickity',progress);
   // });
      
      //$('.btn_pnav_next').off('click').on( 'click', function(e) {

    $col_nav.find('.btn_pnav_next, .btn_pnav_prev').off('click').on( 'click', function(e) {

        //console.log('click me');
        var _this = $(this),
            slider_height = $carouselNav.find('.flickity-slider').height(),
            navHeight = $carouselNav.height(),
            navCellHeight = slider_height/$carouselNav.find('.n-item').length,
            CurentScrollTop = $carouselNav.scrollTop();

        if ( (_this.hasClass('btn_pnav_prev') && CurentScrollTop <= 0) || (_this.hasClass('btn_pnav_next') && CurentScrollTop >= slider_height - navHeight) ) return;

          var scrollY = (_this.hasClass('btn_pnav_next')) ? CurentScrollTop + navCellHeight + 40 : CurentScrollTop - navCellHeight - 40;
          //console.log(height_scroll);
         $carouselNav.stop().animate({
            scrollTop: scrollY
         }, timer);

    });

  };

  geckoShopify.productImagesThumb = function (id,bl) {

    var $el = (id == undefined) ? $('.p-nav') : $('[data-featured-product-se][data-id="'+id+'"] .p-nav');

    if ($el.length == 0) return;

    //if ($('.p-nav').length == 0) return;
        
    // var $mainGallery = $('.p-thumb'),
    //     $thumbs = $('.p-nav'),
    //     class_cl = ($('.thumb_left').length > 0 || $('.thumb_right').length > 0) ? 'col-lg-12 ' : '';
      
    //   $mainGallery.each(function (index) {
    //    var p_nav = $('.p-nav').eq(index);
    //   initThumbnailsMarkup($(this),p_nav);
    //   });

    var $mainGallery = (id == undefined) ? $('.p-thumb') : $('.p-thumb'+id);
    if (id == undefined) {
     var class_cl = ($('.thumb_left').length > 0 || $('.thumb_right').length > 0) ? 'col-lg-12 ' : '';
    } else {
     var class_cl = ($('.thumb_left').length > 0 || $('.thumb_right').length > 0) ? 'col-lg-12 ' : '';
    }

    $mainGallery.each(function (index) {
       var p_nav = ( $el.length == 1) ? $el : $el.eq(index);
       initThumbnailsMarkup($(this),p_nav);
    });
        
    function initThumbnailsMarkup(_this,p_nav) {
      var markup = '',
             e_imgnv = $('.p-nav.ratio_imgtrue').length > 0;

      _this.find('.p-item:not(.is_varhide)').each(function () {
        var _this = $(this),
           grname = _this.data('grname'),
           grpvl = _this.data('grpvl'),
           bgset = _this.data('bgset'),
           alt = _this.data('cap'),
           mdtype = _this.data('mdtype'),
           mdid = _this.data('mdid'),
           ratio = _this.data('ratio'),
           vhost = _this.data('vhost'),
           style = '',
           cl_icon = 'hide';
              
              if (mdtype == 'video') {
                 cl_icon = 'las la-play';
              }  if (mdtype == 'external_video') {
                 cl_icon = 'lab la-'+vhost;
              } else if (mdtype == 'model') {
                 cl_icon = 'las la-cube';
              }
              
              if (e_imgnv) {
                 style = ' style="padding-top:'+1/ratio*100+'%"';
              }
              markup += '<div class="'+class_cl+'col-3 n-item js-sl-item" data-grname="'+grname+'" data-grpvl="'+grpvl+'" data-mdid="'+mdid+'" data-mdtype="'+mdtype+'"><span class="nt_bg_lz lazyload" data-bgset="'+bgset+'" data-widths-none data-ratio="'+ratio+'" data-sizes="auto"'+style+'><i class="'+cl_icon+'"></i></span></div>';
      });

      p_nav.empty().append(markup);
      if (bl) {
        setTimeout(function(){ 
         geckoShopify.refresh_flickity(p_nav);
         geckoShopify.ThumLeftRight(id); 
          p_nav.addClass('p-nav-ready');
        }, 800);
      } else {
        geckoShopify.refresh_flickity(p_nav);
        geckoShopify.ThumLeftRight(id);
        p_nav.addClass('p-nav-ready');
      }
      //p_nav.addClass('p-nav-ready');
    };

  };
      
  geckoShopify.EnaDisDragging = function (id) {
    // if ($('[data-shopify-xr]').length == 0 || $('.p-thumb.flickity-enabled').length == 0) return;

    var pThumb = $('[data-featured-product-se][data-id="'+id+'"]').find('.p-thumb.flickity-enabled'),
        $model = pThumb.find('[data-pr-md-tp-model]').length,
        $video = pThumb.find('[data-pr-md-tp-video]').length;

    if (pThumb.length == 0 || ($model < 1 && $video < 1)) return;
    //console.log('run EnaDisDragging')
    //if ( $('.p-thumb.flickity-enabled').length == 0 ) return;

    //var pThumb = $('.p-thumb');
    pThumb.on( 'select.flickity', function(event, index) {
      // console.log(index);
      // console.log(event);
      var flkty = pThumb.data('flickity'),
          $selectedSlide = pThumb.find('.is-selected'),
          attrselectedSlide = $selectedSlide.attr('data-mdtype'),
          $p_btns = $('.p_group_btns');
      
      $('.p-thumb [data-pr-md-tp-video]').trigger('mediaHidden');

      //console.log(attrselectedSlide);
      $p_btns.removeClass('nt_hide nt_hide_2');
      if ( attrselectedSlide == 'video'  || attrselectedSlide == 'external_video' || attrselectedSlide == 'model' ) {
        
        //$p_btns.addClass('nt_hide');
        // flkty.options.draggable = false;
        // flkty.updateDraggable();

        if ( attrselectedSlide == 'model' ) {
           $p_btns.addClass('nt_hide_2');
           $selectedSlide.find('[data-pr-md-tp-model]').trigger('mediaVisible');
        } else {
           $p_btns.addClass('nt_hide');
           $selectedSlide.find('[data-pr-md-tp-video]').trigger('mediaVisible');
        }

      } 
      // else {
      //   $p_btns.removeClass('nt_hide nt_hide_2');
      //   // if ( !flkty.options.draggable ) {
       //    // flkty.options.draggable = true;
       //    // flkty.updateDraggable();
      //   // }
      // }
 
    });
  };
 // end video,3d
 
 geckoShopify.ProductSection = function (id) {

    var el = (id == undefined) ? $('[data-featured-product-se]') : $('[data-featured-product-se][data-id="'+id+'"]');
    if (el.length == 0) return;

  el.each(function( index ) {
    var se_id = $(this).data('id');
      //var qty_mess = $('#nt_stock_ppr').data('st'); if (qty_mess == 2 || qty_mess == 3) {geckoShopify.progressbar('#nt_stock_ppr')}
      var txt_stock = '#nt_stock'+se_id,
          $nt_stock = $(txt_stock),
          qty_cur = $nt_stock.data('cur'),
          qty_mess = $nt_stock.data('st'),
          ck_inventory = $nt_stock.data('qty');
      if ((qty_mess == 1 || qty_mess == 3) && qty_cur < ck_inventory && qty_cur > 0) {
        geckoShopify.progressbar(txt_stock,qty_cur);
      } else if (qty_mess != 1) {
        geckoShopify.progressbar(txt_stock);
      }

      if (se_id != '_ppr' ) {
        geckoShopify.ATC_animation('#shopify-section-'+se_id+' .single_add_to_cart_button');
      } else {
        geckoShopify.ATC_animation('#shopify-section-pr_summary .single_add_to_cart_button');
        geckoShopify.ATC_animation('#shopify-section-sticky_atc .single_add_to_cart_button');
      }

      geckoShopify.real_time('#counter'+se_id);
      geckoShopify.flashSold('#sold'+se_id);
      geckoShopify.InitCountdown_pr('#nt_countdow'+se_id);
      geckoShopify.delivery_order('#delivery'+se_id);

      geckoShopify.initProductVideo(se_id);
      geckoShopify.EnaDisDragging(se_id);
      geckoShopify.productImagesThumb(se_id,true); 
      //geckoShopify.ThumLeftRight(se_id);
  });
 };

})( jQuery_T4NT );

jQuery_T4NT(document).ready(function($) {

  // geckoShopify.Ntproduct_switch();
  //geckoShopify.ThumLeftRight();
  //geckoShopify.EnaDisDragging();
  geckoShopify.searchDropdown();
  geckoShopify.ajaxPPjs();
  geckoShopify.WidgetCartUpdateMobile();
  geckoShopify.ProductSection();

  // //var qty_mess = $('#nt_stock_ppr').data('st'); if (qty_mess == 2 || qty_mess == 3) {geckoShopify.progressbar('#nt_stock_ppr')}
  // var txt_stock = '#nt_stock_ppr',
  //     $nt_stock = $(txt_stock),
  //     qty_cur = $nt_stock.data('cur'),
  //     qty_mess = $nt_stock.data('st'),
  //     ck_inventory = $nt_stock.data('qty');
  // if ((qty_mess == 1 || qty_mess == 3) && qty_cur < ck_inventory && qty_cur > 0) {
  //   geckoShopify.progressbar(txt_stock,qty_cur);
  // } else {
  //   geckoShopify.progressbar(txt_stock);
  // }
  // geckoShopify.ATC_animation('#shopify-section-pr_summary .single_add_to_cart_button');
  // geckoShopify.ATC_animation('#shopify-section-sticky_atc .single_add_to_cart_button');
  // geckoShopify.real_time('#counter_ppr');
  // geckoShopify.flashSold('#sold_ppr');
  // geckoShopify.InitCountdown_pr('#nt_countdow_ppr');
  // geckoShopify.delivery_order('#delivery_ppr');

  //geckoShopify.intThe4IP('#ship_ppr');
  geckoShopify.clickProduct();
  geckoShopify.spAccordion();
  geckoShopify.spQuantityAdjust();
  geckoShopify.ajaxAddItem();
  geckoShopify.ajaxchangeItem(); 
  geckoShopify.ajaxFbt();
  geckoShopify.ajaxfgr();
  geckoShopify.stickyAddToCart();
  geckoShopify.spNotices();
  geckoShopify.AgreeCheckout();
  geckoShopify.AgreeEmailCheckout();
  geckoShopify.cartLazyUp();
  geckoShopify.searchAjax();
  geckoShopify.searchType();
  geckoShopify.CatHeader8('.h_cat_nav');
  geckoShopify.CatHeader8('.cl_h_search .product_list_widget');
  if ($('.cart_thres_js').length>0 && nt_settings.show_confetti) {
    geckoShopify.CanvasConfetti().init();
  }
  if ($('#store_availability_ppr').attr('data-has-only-default-variant') === 'true') {
    geckoShopify._updateStoreAvailabilityContent($('#store_availability_ppr'),true,$('#store_availability_ppr').attr('data-vid'));
  }

  $script(JSNTT4.data('prjs'), function() {
    geckoShopify.productImages();
    //geckoShopify.productImagesThumb(); 
    geckoShopify.galleryPhotoSwipe();
  });
  
  if ( $('[data-js-callback] .lazypreload.nt_pre_img').length > 0 ) {
    $('[data-js-callback] .lazypreload.nt_pre_img').addClass('lazyload')
    .one('lazyincludeloaded', function(e) {
      
      if (e.detail.content) {
        var content = e.detail.content,
            html = content.split('<!--split-->');
        html = html[1] || html[0];
        e.detail.content = html;
      }

    });
  }

  if ( $('[data-js-callback] .nt_pr_js').length > 0 ) {
    $('[data-js-callback] .nt_pr_js').addClass('lazyload')
    .one('lazyincludeloaded', function(e) {
      
      if (e.detail.content) {
        var content = e.detail.content,
            html = content.split('<!--split-->');
        html = html[1] || html[0];
        e.detail.content = html;
      }

    })
    .one('lazyincluded', function(e) {
      //section id (pr_id)
      var pr_id =  $(e.currentTarget).data('id');
      //console.log('pr_id: ',pr_id)
      geckoShopify.NtproductPage(pr_id);
      geckoShopify.initModelViewerLibraries(pr_id);
      geckoShopify.initShopifyXrLaunch(pr_id);
      $('.nt_mfp_360').addClass('sh_ani_css');
    });
  }
 //  if ($('#callBackVariant_ppr .nt_pr_js.lazyloaded').length > 0 ) { geckoShopify.NtproductPage(); }
  // $('#callBackVariant_ppr .nt_pr_js').one('lazyincluded', function(e) { geckoShopify.NtproductPage(); });


  // if ($('#pr_recommendations.lazyloaded').length > 0 ) { geckoShopify.PrRecommendations() }
  // if ($('#recently_wrap.lazyloaded').length > 0 ) { geckoShopify.recently_viewed() }
  // $('#pr_recommendations').one('lazyloaded', function(e) { geckoShopify.PrRecommendations(); });
 //  $('#recently_wrap').one('lazyloaded', function(e) { geckoShopify.recently_viewed(); });


  if ( $('#pr_recommendations').length > 0 ) {
    $('#pr_recommendations').addClass('lazyload').one('lazyloaded', function(e) {
      geckoShopify.PrRecommendations();
    });
  }
  if ( $('#recently_wrap').length > 0 ) {
    $('#recently_wrap').addClass('lazyload').one('lazyloaded', function(e) {
      geckoShopify.recently_viewed();
    });
  }
    
  // Youtube API callback
  // eslint-disable-next-line no-unused-vars
  //function onYouTubeIframeAPIReady() {
 //  window.onYouTubeIframeAPIReady = function() {
  //   console.log('onYouTubeIframeAPIReady');
  //   //theme.Video.loadVideos();

 //   console.log('asdas kkk:  ');
 //   console.log(geckoShopify.ProductVideo().hosts.youtube);
  //   geckoShopify.ProductVideo().loadVideos(geckoShopify.ProductVideo().hosts.youtube);
  // }
});

// Youtube API callback
// eslint-disable-next-line no-unused-vars
function onYouTubeIframeAPIReady() {
    jQuery_T4NT('body').trigger('youTubeReady');
    geckoShopify.ProductVideo().loadVideos(geckoShopify.ProductVideo().hosts.youtube);
}