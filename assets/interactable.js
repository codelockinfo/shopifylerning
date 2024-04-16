/*! hoverIntent v1.10.0 */
!function(factory){"use strict";"function"==typeof define&&define.amd?define(["jQuery_T4NT"],factory):"object"==typeof module&&module.exports?module.exports=factory(require("jQuery_T4NT")):jQuery_T4NT&&!jQuery_T4NT.fn.hoverIntent&&factory(jQuery_T4NT)}(function($){"use strict";var cX,cY,_cfg={interval:100,sensitivity:6,timeout:0},INSTANCE_COUNT=0,track=function(ev){cX=ev.pageX,cY=ev.pageY},compare=function(ev,$el,s,cfg){if(Math.sqrt((s.pX-cX)*(s.pX-cX)+(s.pY-cY)*(s.pY-cY))<cfg.sensitivity)return $el.off(s.event,track),delete s.timeoutId,s.isActive=!0,ev.pageX=cX,ev.pageY=cY,delete s.pX,delete s.pY,cfg.over.apply($el[0],[ev]);s.pX=cX,s.pY=cY,s.timeoutId=setTimeout(function(){compare(ev,$el,s,cfg)},cfg.interval)};$.fn.hoverIntent=function(handlerIn,handlerOut,selector){var instanceId=INSTANCE_COUNT++,cfg=$.extend({},_cfg);$.isPlainObject(handlerIn)?(cfg=$.extend(cfg,handlerIn),$.isFunction(cfg.out)||(cfg.out=cfg.over)):cfg=$.isFunction(handlerOut)?$.extend(cfg,{over:handlerIn,out:handlerOut,selector:selector}):$.extend(cfg,{over:handlerIn,out:handlerIn,selector:handlerOut});var handleHover=function(e){var ev=$.extend({},e),$el=$(this),hoverIntentData=$el.data("hoverIntent");hoverIntentData||$el.data("hoverIntent",hoverIntentData={});var state=hoverIntentData[instanceId];state||(hoverIntentData[instanceId]=state={id:instanceId}),state.timeoutId&&(state.timeoutId=clearTimeout(state.timeoutId));var mousemove=state.event="mousemove.hoverIntent.hoverIntent"+instanceId;if("mouseenter"===e.type){if(state.isActive)return;state.pX=ev.pageX,state.pY=ev.pageY,$el.off(mousemove,track).on(mousemove,track),state.timeoutId=setTimeout(function(){compare(ev,$el,state,cfg)},cfg.interval)}else{if(!state.isActive)return;$el.off(mousemove,track),state.timeoutId=setTimeout(function(){!function(ev,$el,s,out){delete $el.data("hoverIntent")[s.id],out.apply($el[0],[ev])}(ev,$el,state,cfg.out)},cfg.timeout)}};return this.on({"mouseenter.hoverIntent":handleHover,"mouseleave.hoverIntent":handleHover},cfg.selector)}});

 (function( $ ) {
   "use strict";
    var body = $('body'),
       _rtl = body.hasClass('rtl_true'),
       $ld = $('#ld_cl_bar'),
       yesHover = Modernizr.hovermq,
       touchevents = Modernizr.touchevents,
       window_w = $(window).width(),
       wis_ntjs = $('#wis_ntjs'),
       wis_view = wis_ntjs.data('get'),
       use_vimg = nt_settings.use_vimg,
       geckoTheme = {
          popupAnimation: 'mfp-move-horizontal',
          ajaxSelector: '#cat_shopify a:not(.nav-expand-link),.cat-shop #cat_shopify a.nav-expand-link, #nt_sortby .wrap_sortby a, .nt_ajaxFilter a, .paginate_ajax a, .nav_filters a, .widget_product_tag_cloud a,a.clear_filter',
          scrollSelector: '.shopify-error a[href^="#"]',
          nt_btn_load_more : '.load-on-scroll:not(.btn--loader-active)',
          url_currency : 'https://api.teathemes.net/currency',
          money_format : '${{amount}}'
    };

    geckoShopify.swatchesOnBGGrid = function() { 
       var hide_ic_lz = 'hide_ic_lz',
           pr_curent = nt_settings.pr_curent;
           
       var swatches_js = function ( $this ) {
            var imagebg = $this.data('bgset'),
               paddingImg = $this.data('pd'),
               id = $this.data('id'),
               vid = $this.data('vid'),
               product = $this.parents('.nt_pr'),
               image = product.find('.main-img'),
               id_img = image.attr('data-id'),
               href = product.find('.product-title>a').attr('href');

            $this.parents('.swatch__list_js').find('.current-swatch').removeClass('current-swatch');
            $this.parents('.swatch__list--opended').find('.current-swatch').removeClass('current-swatch');
            $this.addClass('current-swatch');

            if( id  == id_img ) return;
               product.addClass('nt-swatched');

             if ($this.hasClass('loaded_swatch')) {
                image.addClass(hide_ic_lz); 
             } else {
                image.removeClass(hide_ic_lz); 
             }

             $this.addClass('loaded_swatch'); 
            //product.addClass('loading-qs');
            // if (typeof paddingImg !== "undefined") {
            //    image.attr('data-bgset', imagebg).css('padding-top', paddingImg+'%').attr('data-id', id);
            // } else {
            //    image.attr('data-bgset', imagebg).attr('data-id', id);
            // }
            image.attr('data-bgset', imagebg).attr('data-id', id);
            if ( pr_curent == '1') return;
            
            if (href.indexOf("?variant=") > -1) {
              product.find('a').attr('href',href.split('?variant=')[0]+'?variant='+vid);
            } else if (href.indexOf("?") > -1) {
              product.find('a').attr('href',href.split('&variant=')[0]+'&variant='+vid);
            } else {
              product.find('a').attr('href',href+'?variant='+vid);
            }
            product.find('.nt_add_qv').attr('data-id',vid);
       };

       body.on('click', '.nt_swatch_on_bg:not(.current-swatch)', function() {
          if (!touchevents) return;
            swatches_js($(this));
            //  image.attr('data-chksrc', imageSrc);
            // product.removeClass('loading-qs');

       });

      if (touchevents) return;
      body.hoverIntent({ 
         selector: '.nt_swatch_on_bg',   
         sensitivity: 6,
         interval: 100,
         timeout: 100, 
         over:function(t){
            //console.log('over ')
            swatches_js( $(this) );
         },
         out: function(){}
      });


      // body.hoverIntent({ 
      //    selector: '.pin_tt_js',   
      //    sensitivity: 6,
      //    interval: 100,
      //    timeout: 100, 
      //    over:function(t){


      //      var ck = 0,
      //          cl = 'pin__opened',
      //          _this = $( this ).parent('.pin__type');
      //      if (_this.hasClass('pin__opened')) { ck = 1}
      //      $('.pin__type.pin__opened').removeClass('pin__opened');
      //      $('.pin__slider.pin_slider_opened').removeClass('pin_slider_opened');
      //      //(ck) ?  _this.addClass('pin__opened') :  _this.removeClass('pin__opened');
      //      if ( ck ) return;
            
      //      var sp_section = $( this ).closest('.shopify-section');
      //      _this.addClass('pin__opened');
      //      sp_section.find('.pin__slider').addClass('pin_slider_opened');
           
      //      if ( _this.hasClass('has_calc_pos') ) return;

      //      var pos = _this.offset(),
      //          pin_pp = _this.find('.pin__popup'),
      //          pin_parent = _this.find('.pin_lazy_js');
      //          //console.log(pos);
      //       if (pin_parent.length == 0) {pin_parent = pin_pp;}
      //          //console.log(pin_parent);

      //       if (pin_parent.hasClass('pin__popup--left')) {
      //          var w_popup = pin_pp.width() + 20;
      //          if ( pos.left < w_popup ) {
      //             //pin_parent.removeClass('pin__popup--left').addClass('pin__popup--right');
      //             var mrRight = w_popup - pos.left + 10;
      //             pin_pp.css("margin-right", '-' + mrRight + 'px');
      //          }
      //       } else if (pin_parent.hasClass('pin__popup--right')) {
      //          var w_popup = pin_pp.width() + 20,
      //              posRight = $(window).width() - pos.left - _this.width();
      //          if ( posRight < w_popup ) {
      //             ///pin_parent.removeClass('pin__popup--right').addClass('pin__popup--left');
      //             var mrLeft = w_popup - posRight + 10;
      //             pin_pp.css("margin-left", '-' + mrLeft + 'px');
      //          }
      //       }

      //       // } else if (pin_parent.hasClass('pin__popup--top') && sp_section.hasClass('type_pin_owl')) {
      //       //    var h_popup = pin_pp.height() + 20;
      //       //    //console.log(h_popup);

      //       //    if ( pos.top < h_popup ) {
      //       //       //pin_parent.removeClass('pin__popup--top').addClass('pin__popup--bottom');
      //       //       var mrBotom = h_popup - pos.top + 10;
      //       //       pin_pp.css("margin-bottom", '-' + mrBotom + 'px');
      //       //    }
               
      //       // } else if (pin_parent.hasClass('pin__popup--bottom') && sp_section.hasClass('type_pin_owl')) {
      //       //    var h_popup = pin_pp.height() + 20,
      //       //        posBottom = sp_section.height() - (pos.top+25) - _this.width();
      //       //        //console.log(posBottom);

      //       //    if ( posBottom < h_popup ) {
      //       //       //pin_parent.removeClass('pin__popup--bottom').addClass('pin__popup--top');
      //       //       var mrTop = h_popup - posBottom + 10;
      //       //       pin_pp.css("margin-top", '-' + mrTop + 'px');
      //       //    }

      //       // }
      //       if (!designMode) { _this.addClass('has_calc_pos') }
      //    },
      //    out: function(){
      //     $('.pin__type.pin__opened').removeClass('pin__opened');
      //     $('.pin__slider.pin_slider_opened').removeClass('pin_slider_opened');
      //    }
      // });

    };
         
    geckoShopify.ideaIntent = function() {

      if (!yesHover) return;
      body.find("li.idea_intent").each(function() {
          var $this = $(this);
          $this.hoverIntent({
          sensitivity: 3,
          interval: 70,
          timeout: 70, 
              over: function(ever) {
                  $this.addClass("current_intent");
              },
              out: function() {
                  $this.removeClass("current_intent")
              }
          })
      });
      
      // https://github.com/robbue/jQuery.panr
      // $(".cat_grid_item__link").mousemove(function(e) {
      //           var $this = $(this);
      //           $this.addClass("current_intent");
      //           var r = $this[0].getBoundingClientRect(),
      //           x = ever.clientX - (r.left + Math.floor(r.width / 2)),
      //           y = ever.clientY - (r.top + Math.floor(r.height / 2)),
      //           d = '--x:' + x + ';--y:' + y;
      //           console.log(d);
      //           $this.attr('style', d); 
      // }).mouseleave(function(ever) {
      //           var $this = $(this);
      //           $this.removeClass("current_intent");
      //           $this.attr('style', ''); 
      // });
    };

   
   geckoShopify.cartPosDropdown = function() {
     
      if (!body.hasClass('cart_pos_dropdown') || touchevents || body.hasClass('template-cart')) return;
        var $cart = $('#nt_cart_canvas'),
            $icon_cart = $('.cart_pos_dropdown .icon_cart'),
            $window = $(window),
            fullHeight = 60,
            windowHeight = $window.height(),
            windowWidth = $window.width(), 
            offsetTop = $icon_cart.offset().top,
            right = (windowWidth - ($icon_cart.offset().left + $icon_cart.outerWidth())),
            outerH = $icon_cart.outerHeight(),
            top = offsetTop + 40; 

          $cart.css({
               'position' : 'absolute',
               'top' : top,
               'right' : right
          }); 

          if (offsetTop < windowHeight) {
           var fullHeight = 100 - (offsetTop+40) / (windowHeight / 100);
          }

        $icon_cart.hoverIntent({ 
           sensitivity: 6,
           interval: 100,
           timeout: 100, 
           over:function(t){
              //console.log(t);
            //console.log('a11');
              top = $icon_cart.offset().top + 40;
              body.addClass('oped_dropdown_cart');
              $cart.css("top", top).addClass("current_hover");
           },
           out: function(){
            //console.log('out');
            if ($cart.is(":hover")) return;
              body.removeClass('oped_dropdown_cart');
              $cart.removeClass("current_hover");
           }
        });

        $cart.on("mouseleave", function () {
          // console.log('mouseleave');
            body.removeClass('oped_dropdown_cart');
            $cart.removeClass("current_hover");
        });
   };

    // geckoShopify.headerCategoriesMenu = function () {

    //   if (!touchevents || $('#cat_shopify').length == 0 ) return;

    //   var cat_shop = $('#shopify-section-cat_shop'),
    //     button = cat_shop.find('.cat_nav_js'),
    //     catsUl = $('#cat_shopify'),
    //     time = 200;

    //   cat_shop.on('click', '.cat_nav_js', function (e) {
    //     e.preventDefault();

    //     if (isOpened()) {
    //       closeCats();
    //     } else {
    //       //setTimeout(function() {
    //       openCats();
    //       //}, 50);
    //     }
    //   });

    //   catsUl.on('click', '.menu-item-has-children>a', function (e) {
    //     e.preventDefault();
    //     var sublist = $(this).parent().find('> .sub-menu');
    //     if (sublist.hasClass('child-open')) {
    //       $(this).removeClass("act-icon");
    //       sublist.slideUp(time).removeClass('child-open');
    //     } else {
    //       $(this).addClass("act-icon");
    //       sublist.slideDown(time).addClass('child-open');
    //     }
    //   });

    //   // catsUl.on('click', 'a', function (e) {
    //   //   closeCats();
    //   //   catsUl.stop().attr('style', '');
    //   // });

    //   var isOpened = function () {
    //     return catsUl.hasClass('cat_opened');
    //   };

    //   var openCats = function () {
    //     catsUl.addClass('cat_opened').stop().slideDown(time);
    //     button.addClass('btn_open');

    //   };

    //   var closeCats = function () {
    //     catsUl.removeClass('cat_opened').stop().slideUp(time);
    //     button.removeClass('btn_open');
    //   };

    // };
    geckoShopify.headerCategoriesMenu = function () {

      if ($('#cat_shopify').length == 0 ) return;
      //if (!touchevents || $('#cat_shopify').length == 0 ) return;

      var cat_shop = '#shopify-section-cat_shop',
        button = '#shopify-section-cat_shop .cat_nav_js',
        catsUl = '#cat_shopify',
        time = 200;

      body.on('click', cat_shop+' .cat_nav_js', function (e) {
        e.preventDefault();

        if (isOpened()) {
          closeCats();
        } else {
          //setTimeout(function() {
          openCats();
          //}, 50);
        }
      });

      body.on('click', catsUl+' .menu-item-has-children>a', function (e) {
        e.preventDefault();
        var sublist = $(this).parent().find('> .sub-menu');
        if (sublist.hasClass('child-open')) {
          $(this).removeClass("act-icon");
          sublist.slideUp(time).removeClass('child-open');
        } else {
          $(this).addClass("act-icon");
          sublist.slideDown(time).addClass('child-open');
        }
      });

      // catsUl.on('click', 'a', function (e) {
      //   closeCats();
      //   catsUl.stop().attr('style', '');
      // });

      var isOpened = function () {
        return $(catsUl).hasClass('cat_opened');
      };

      var openCats = function () {
        $(catsUl).addClass('cat_opened').stop().slideDown(time);
        $(button).addClass('btn_open');

      };

      var closeCats = function () {
        $(catsUl).removeClass('cat_opened').stop().slideUp(time);
        $(button).removeClass('btn_open');
      };

    };

    geckoShopify.popupMFP = function () {
      body.on('click', '[data-opennt]', function (e) {
      //$("[data-opennt]").on("click", function(e) {
          var $this = $(e.currentTarget),
              html = $("html"),
              datas = $this.data(),
              id = datas.opennt,
              color = datas.color,
              bg = datas.bg,
              position = datas.pos,
              ani = datas.ani || 'has_ntcanvas',
              remove = datas.remove,
              cl = datas.class,
              close = datas.close || false,
              focuslast = datas.focuslast || false,
              focus = $this.attr("data-focus"),
              YOffset = window.pageYOffset,
              height = window.height - $('#shopify-section-header_banner').outerHeight() - $('.ntheader_wrapper').outerHeight();
          //$this.offset();
          //console.log($this.offset())
          //console.log(ani)

          var nt_scroll = function () {
            if( !YOffset) return; 
            $('html, body').scrollTop(YOffset);
          }
          $this.addClass("current_clicked");
           $.magnificPopup.open({
              items: {
                  src: id,
                  type: "inline",
                  tLoading: '<div class="loading-spin dark"></div>'
              },
              tClose: nt_settings.close,
              removalDelay: 300,
              closeBtnInside: close,
              focus: focus,
              autoFocusLast: focuslast,
              callbacks: {
                  beforeOpen: function() {
                      this.st.mainClass = ani + " " + color + " " + ani+"_" + position;
                      //html.addClass('fix_ov_scroll');$("#nt_wrapper").css("max-height", height);
                  },
                  open: function() {
                      //$("html,body").addClass('hidden_y');
                      html.addClass(ani); 
                      html.addClass(ani+"_" + position); 
                      cl && $(".mfp-content").addClass(cl); 
                      bg && $(".mfp-bg").addClass(bg); 
                      //$(".mfp-content .resize-select").change(); 
                      //$.fn.packery && $("[data-packery-options], .has-packery").packery("layout")
                        // body.find(ani+" .nt_simplebar").each(function() {
                        //    var $this = $(this)[0];
                        //    new SimpleBar($this, { autoHide: false });
                        //    //new SimpleBar($('.nt_simplebar'), { autoHide: false });
                        // });
                        //geckoShopify.catAccordion();
                        body.on('click', '.close_pp', function(e) {
                           e.preventDefault();
                           $.magnificPopup.close();
                        });
                        nt_scroll();



                  },
                  beforeClose: function() {
                      html.removeClass(ani);
                      //$("html,body").removeClass('hidden_y');
                      //nt_scroll();

                  },
                  afterClose: function() {
                      html.removeClass(ani+"_" + position); 
                      //html.removeClass('fix_ov_scroll');$("#nt_wrapper").css("max-height",'' );
                      $(".current_clicked").removeClass("current_clicked"); 
                      remove && $(id).removeClass("mfp-hide");
                  }
              }
          });
         e.preventDefault()
      })
    };

    // Product quick view
    geckoShopify.initQuickView = function () {
      body.on('click', '.js_add_qv', function (e) {
         e.preventDefault();
         e.stopPropagation();
         //e.stopImmediatePropagation();

         if (designMode) return;
         //$.magnificPopup.close();
         var btn = $(this),
             res = null, ntid = 
             btn.attr('data-id'), 
             href = btn.attr('href');
         //console.log(ntid)
         if(sp_nt_storage) {res = sessionStorage.getItem('qv'+ntid)}
         if (res !== null) {
            btn.addClass('loading');
            // if ($('.mfp-content').length > 0 ) {
            //   $.magnificPopup.close();
            //   setTimeout(function(){ quickview_js(false,res,btn,ntid,href); }, 555);
            // } else {
            //   quickview_js(false,res,btn,ntid,href);
            // }
            if ($.magnificPopup.instance.isOpen) {
               $.magnificPopup.close();
               setTimeout(function(){  quickview_js(false,res,btn,ntid,href); }, $.magnificPopup.instance.st.removalDelay+10);
            } else {
              quickview_js(false,res,btn,ntid,href);
            }
         } else { 
            //console.log(href)
            var a = (href.indexOf('?variant=') > -1 || href.indexOf('&variant=') > -1) ? '&' : '/?';
            $.ajax({
               beforeSend: function () {
                  btn.addClass('loading');
               },
               url: href+a+'view=quick_view',
               success: function (data) {
                  // if ($('.mfp-content').length > 0 ) {
                  //   $.magnificPopup.close();
                  //   setTimeout(function(){ quickview_js(true,data,btn,ntid,href); }, 555);
                  // } else {
                  //   quickview_js(true,data,btn,ntid,href);
                  // }
                  if ($.magnificPopup.instance.isOpen) {
                     $.magnificPopup.close();
                     setTimeout(function(){  quickview_js(true,data,btn,ntid,href); }, $.magnificPopup.instance.st.removalDelay+10);
                  } else {
                    quickview_js(true,data,btn,ntid,href);
                  }
               },
               complete: function () {
                  $('.loader').remove();
                  btn.removeClass('loading');
               }
            })
         }
         // return false; //for good measure
         // e.preventDefault();
         // e.stopPropagation();
      });

      var quickview_js = function (bl,dt,btn,ntid,href) {
         $.magnificPopup.open({
            items: {
               src: '<div class="mfp-with-anim popup-quick-view" id="content_quickview">' + dt + '</div>', // can be a HTML string, jQuery_T4NT object, or CSS selector
               type: 'inline'
            },
            tClose: nt_settings.close,
            removalDelay: 500, //delay removal by X to allow out-animation
            callbacks: {
               beforeOpen: function () {
                  this.st.mainClass = 'mfp-move-horizontal';
               },
               open: function () {

                  btn.addClass('pp_t4_opended');
                  var el = $('.nt_carousel_qv'),option = el.attr("data-flickity") || '{}';
                  //console.log(option)
                  el.flickity(JSON.parse(option));

                  body.addClass('open_ntqv');
                  geckoShopify.ATC_animation('#callBackVariant_qv .single_add_to_cart_button');
                  geckoShopify.InitCountdown_pr('#nt_countdow_qv');
                  geckoShopify.wishlistUpdate(0,ntid);
                  geckoShopify.compareUpdate(0,ntid);
                  // var qty_mess = $('#nt_stock_qv').data('st');
                  // if (qty_mess == 2 || qty_mess == 3) {geckoShopify.progressbar('#nt_stock_qv')}
                    var txt_stock = '#nt_stock_qv',
                      $nt_stock = $(txt_stock),
                      qty_cur = $nt_stock.data('cur'),
                      qty_mess = $nt_stock.data('st'),
                      ck_inventory = $nt_stock.data('qty');
                  // if ((qty_mess == 1 || qty_mess == 3) && qty_cur < ck_inventory && qty_cur > 0) {
                  //   geckoShopify.progressbar(txt_stock,qty_cur);
                  // } else {
                  //   geckoShopify.progressbar(txt_stock);
                  // }
                  if ((qty_mess == 1 || qty_mess == 3) && qty_cur < ck_inventory && qty_cur > 0) {
                    geckoShopify.progressbar(txt_stock,qty_cur);
                  } else if (qty_mess != 1) {
                    geckoShopify.progressbar(txt_stock);
                  }
                  geckoShopify.delivery_order('#delivery_qv');
                  geckoShopify.real_time('#counter_qv');
                  geckoShopify.flashSold('#sold_qv');
                  //geckoShopify.intThe4IP('#ship_qv');
                  body.trigger('refresh_currency');

                  if(typeof addthis !== 'undefined') {addthis.layers.refresh()}
                  
                  if(sp_nt_storage && bl) {
                    sessionStorage.setItem('qv'+ntid, dt)
                  }

                  $('#content_quickview .entry-title a, #content_quickview .detail_link').attr("href",href);
                  btn.removeClass('loading');
                  
                  geckoShopify.DropdownPicker();
                  geckoShopify.review();
                  if ($('#content_quickview .buy_qv_true').length > 0) {
                    Shopify.PaymentButton.init();
                  }
                  if ($('#store_availability_qv').attr('data-has-only-default-variant') === 'true') {
                      geckoShopify._updateStoreAvailabilityContent($('#store_availability_qv'),true,$('#store_availability_qv').attr('data-vid'));
                  }
                  $('#content_quickview .lazypreload.nt_pre_img').addClass('lazyload');

                  if (!$('#ProductJson-template_qv').html()) {
                    return;
                  }

                  var productJson = JSON.parse($('#ProductJson-template_qv').html()),
                    incomingJson = JSON.parse($('#ProductJson-incoming_qv').html()),
                    IdSelect = '#product-select_qv',NtId = '#nt_select_qv_',selector = '#cart-form_qv',callBackVariant = '#callBackVariant_qv',prefix='_qv',
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
                  geckoShopify.Ntproduct_switch('.variations_form_qv',Arr_MD,productJson,selector,IdSelect,NtId,callBackVariant,prefix);
                  if (nt_settings.pr_curent !== "1" || $('#cart-form_qv .is-selected-nt').length > 0 ) {
                      $('#nt_select_qv_1 .is-selected-nt, #nt_select_qv_2 .is-selected-nt').addClass('is-selected').removeClass('is-selected-nt');
                      $('#nt_select_qv_0 .is-selected-nt').click().removeClass('is-selected-nt');
                    
                      if (!use_vimg) return;
                      $('#nt_select_qv_1 .is-selected,#nt_select_qv_2 .is-selected').removeClass('is-selected').click();
                  }

                  // if ($('.product-quickview').hasClass('img_action_zoom') && $(window).width() > 1024 ) {
                  //    var zoom_target = $('.nt_carousel_qv .q-item');
                  //    var zoom_width = $('.nt_carousel_qv').width();
                  //    zoom_target.each(function () {
                  //       var $this = $(this).find('.nt_bg_lz');

                  //       if ($this.attr('data-width') > zoom_width ) {
                  //          $this.zoom({
                  //             url: $this.attr('data-src'),
                  //             magnify: nt_settings.z_magnify,
                  //             touch: nt_settings.z_touch 
                  //          });
                  //       }

                  //    });
                  // }
               },
                beforeClose: function() {
                  if ( $('.store_availabilities_modal.act_opened').length > 0) {
                    $('.store_availabilities_modal .close_pp').trigger('click');
                  }
                },
               close: function () {
                  $('#content_quickview').empty();
                  body.trigger('refresh_hreft4');
                  btn.removeClass('pp_t4_opended');
                  body.removeClass('open_ntqv');
                  geckoShopify.DropdownPicker();
               }
            },
         });
      };

    };

    // QuickShop
    geckoShopify.quickShop = function () {
      var clicked_ed_js = 'clicked_ed_js';
      body.on('click', '.js__qs', function (e) {
         e.preventDefault();
         e.stopPropagation();

         if (designMode) return;
         //$.magnificPopup.close();
         var btn = $(this),res = null, ntid = btn.attr('data-id'), href = btn.attr('href');
         //console.log(ntid)
         if(sp_nt_storage) {res = sessionStorage.getItem('qs'+ntid)}
         if (res !== null) {
            btn.addClass('loading qs_opened '+clicked_ed_js);
            // if ($('.mfp-content').length > 0 ) {
            //   $.magnificPopup.close();
            //   setTimeout(function(){ quickshop_js(false,res,btn,ntid,href); }, 555);
            // } else {
            //   quickshop_js(false,res,btn,ntid,href);
            // }
            if ($.magnificPopup.instance.isOpen) {
               $.magnificPopup.close();
               setTimeout(function(){  quickshop_js(false,res,btn,ntid,href); }, $.magnificPopup.instance.st.removalDelay+10);
            } else {
              quickshop_js(false,res,btn,ntid,href);
            }
         } else { 
            //console.log(href)
            var a = (href.indexOf('?variant=') > -1 || href.indexOf('&variant=') > -1) ? '&' : '/?';
            $.ajax({
               beforeSend: function () {
                  btn.addClass('loading '+clicked_ed_js);
                  //btn.addClass('loading qs_opened '+clicked_ed_js);
               },
               url: href+a+'view=quick_shop',
               success: function (data) {
                  // if ($('.mfp-content').length > 0 ) {
                  //   $.magnificPopup.close();
                  //   setTimeout(function(){ quickshop_js(true,data,btn,ntid,href); }, 555);
                  // } else {
                  //   quickshop_js(true,data,btn,ntid,href);
                  // }
                  if ($.magnificPopup.instance.isOpen) {
                     $.magnificPopup.close();
                     setTimeout(function(){  quickshop_js(true,data,btn,ntid,href); }, $.magnificPopup.instance.st.removalDelay+10);
                  } else {
                    quickshop_js(true,data,btn,ntid,href);
                  }
               },
               complete: function () {
                  $('.loader').remove();
                  btn.removeClass('loading');
               }
            })
         }
         // return false; //for good measure
         // e.preventDefault();
         // e.stopPropagation();
      });

      var quickshop_js = function (bl,dt,btn,ntid,href) {
       $.magnificPopup.open({
          items: {
             src: '<div class="mfp-with-anim pp_qs" id="content_quickview">' + dt + '</div>', // can be a HTML string, jQuery_T4NT object, or CSS selector
             type: 'inline'
          },
          tClose: nt_settings.close,
          removalDelay: 500, //delay removal by X to allow out-animation
          callbacks: {
             beforeOpen: function () {
                this.st.mainClass = 'mfp-move-vertical';
             },
             open: function () {
              btn.addClass('pp_t4_opended');
                  var el = $('.nt_carousel_qs'),option = el.attr("data-flickity") || '{}';
                  //console.log(option)
                  el.flickity(JSON.parse(option));
                body.addClass('open_ntqs');
                
                if(sp_nt_storage && bl) {sessionStorage.setItem('qs'+ntid, dt)}
                //$('#content_quickview .entry-title a, #content_quickview .detail_link').attr("href",href);
                btn.removeClass('loading');
                
                geckoShopify.DropdownPicker();
                geckoShopify.review();
                if ($('#content_quickview .buy_qs_true').length > 0) {
                  Shopify.PaymentButton.init();
                }
                if ($('#store_availability_qs').attr('data-has-only-default-variant') === 'true') {
                    geckoShopify._updateStoreAvailabilityContent($('#store_availability_qs'),true,$('#store_availability_qs').attr('data-vid'));
                }
                $('#content_quickview .lazypreload.nt_pre_img').addClass('lazyload');

                if (!$('#ProductJson-template_qs').html()) {
                  return;
                }

                var productJson = JSON.parse($('#ProductJson-template_qs').html()),
                  incomingJson = JSON.parse($('#ProductJson-incoming_qs').html()),
                  IdSelect = '#product-select_qs',NtId = '#nt_select_qs_',selector = '#cart-form_qs',callBackVariant = '#callBackVariant_qs',prefix='_qs',
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

                geckoShopify.Ntproduct_switch('.variations_form_qs',Arr_MD,productJson,selector,IdSelect,NtId,callBackVariant,prefix);
                if (nt_settings.pr_curent !== "1" || $('#cart-form_qs .is-selected-nt').length > 0 ) {
                    $('#nt_select_qs_1 .is-selected-nt, #nt_select_qs_2 .is-selected-nt').addClass('is-selected').removeClass('is-selected-nt');
                    $('#nt_select_qs_0 .is-selected-nt').click().removeClass('is-selected-nt');
                        
                    if (!use_vimg) return;
                    $('#nt_select_qs_1 .is-selected,#nt_select_qs_2 .is-selected').removeClass('is-selected').click();
                }
             },
                beforeClose: function() {
                  if ( $('.store_availabilities_modal.act_opened').length > 0) {
                    $('.store_availabilities_modal .close_pp').trigger('click');
                  }
                },
             close: function () {
                $('.'+clicked_ed_js).removeClass(clicked_ed_js);
                $('#content_quickview').empty();
                body.trigger('refresh_hreft4');
                btn.removeClass('pp_t4_opended');
                body.removeClass('open_ntqs');
                geckoShopify.DropdownPicker();
             }
          },
       });
      };

    };


   function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
   };

    
    var wis_atc_added = nt_settings.wis_atc_added,
        cl_w1 = 'wis_added',
        cl_w2 = '.wis_remve',
        txt_view = wis_ntjs.find('.txt_view').text();

    if (wis_atc_added == '2') {
        var txt_add = wis_ntjs.find('.txt_add').text();
        // cl_w1 = 'wis_added wis_remve';
        cl_w1 = 'wis_added';
        cl_w2 = '.wis_remve, .wis_added';
        txt_view = wis_ntjs.find('.txt_remve').text();
    }
    geckoShopify.wishlistLocal = function () {
      if (!sp_nt_storage || nt_settings.wishlist_type != '1') return;
      
      var limit = 80;
      // var txt_view = wis_ntjs.find('.txt_view').text(),
      //     limit = 80,
      //     cl_w1 = 'wis_added',
      //     cl_w2 = '.wis_remve';

      // if (wis_atc_added == '2') {
      //     cl_w1 = 'wis_added wis_remve';
      //     cl_w2 = '.wis_remve, .wis_added';
      //     txt_view = wis_ntjs.find('.txt_remve').text();
      // }

      // add wishlist
      body.on('click', '.wishlistadd', function (e) {
        e.preventDefault();
        var _this = $(this),
            dt_id = _this.data('id') || '',
            id = 'id:'+dt_id,
            ls = localStorage.getItem('nt_wis');

        // check id exit
        if (id.length < 6) return;
        _this.addClass('pe_none');

        if (ls != null && ls.length > 0) { 
           var arrls = ls.split(',');
           arrls.unshift(id);
        } else {
          var arrls = new Array();
           arrls.unshift(id);
        }
        arrls = arrls.filter(onlyUnique);

        if ( arrls.length > limit){ arrls = arrls.splice(0,limit) }
        localStorage.setItem('nt_wis', arrls.toString());
         
        //_this.removeClass('pe_none wishlistadd').addClass('wis_added').find('.tt_txt').text(txt_view);
        $('.wishlistadd[data-id="'+dt_id+'"]').removeClass('pe_none wishlistadd').addClass(cl_w1).find('.tt_txt').text(txt_view);
        geckoShopify.wishlistUpdate(1);

      });

      // triger click
      body.on('click', '.wis_added,.js_link_wis', function (e) {
         e.preventDefault();
        if (wis_atc_added == '2' && !$(this).hasClass('js_link_wis')) return;
         // console.log('wis_added');
        $ld.trigger( "ld_bar_star" );
        setTimeout(function(){ $ld.trigger( "ld_bar_end" ); }, 300);
        window.location.href = wis_ntjs.attr('href');
      });

      // remove wishlist
      body.on('click', cl_w2, function (e) {
        e.preventDefault();
        var _this = $(this),
            dt_id = _this.data('id'),
            id = 'id:'+dt_id,
            ls = localStorage.getItem('nt_wis'),
            un_wis_added = !_this.hasClass('wis_added');
        
        _this.addClass('pe_none wishlistadd');
        var arrls = ls.split(','),
            index = arrls.indexOf(id);
            // console.log(arrls);
          if (index > -1) {
            arrls = arrls.splice(0,limit+1);
            arrls.splice(index, 1);
          } else {
            arrls = arrls.splice(0,limit);
          }
          // console.log(arrls);
          localStorage.setItem('nt_wis', arrls.toString());
            if (un_wis_added) {
             _this.closest('.nt_pr').remove();
            } else {
              // update when remove wislist on quickview
              $('.wis_added[data-id="'+dt_id+'"]').removeClass('wis_remve wis_added').addClass('wishlistadd').find('.tt_txt').text(txt_add);
            }
            _this.removeClass('pe_none wis_remve wis_added');
           geckoShopify.wishlistUpdate(1);
           if (arrls.toString() == '' && un_wis_added) {
             window.location.href = wis_ntjs.attr('href');
           }
      });


    };


  /**
   *-------------------------------------------------------------------------------------------------------------------------------------------
   * ThemeT4 compare functions
   *-------------------------------------------------------------------------------------------------------------------------------------------
   */
    geckoShopify.ThemeT4Compare = function () {
      if (!sp_nt_storage || $('#cp_ntjs').length == 0) return;
      
      var txt_view = nt_settings.added_text_cp,
          cp_ntjs = $('#cp_ntjs'),
          limit = 6;

      // add wishlist
      body.on('click', '.compare_add', function (e) {
        e.preventDefault();
        var _this = $(this),
            dt_id = _this.data('id') || '',
            id = 'id:'+dt_id,
            ls = localStorage.getItem('nt_cp');
        
        if (id.length < 6) return;
        _this.addClass('pe_none');

        if (ls != null && ls.length > 0) { 
           var arrls = ls.split(',');
           arrls.unshift(id);
        } else {
          var arrls = new Array();
           arrls.unshift(id);
        }
        //console.log(arrls)
        arrls = arrls.filter(onlyUnique);
        //console.log(arrls)

        if ( arrls.length > limit){ arrls = arrls.splice(0,limit) }
        localStorage.setItem('nt_cp', arrls.toString());
         
        //_this.removeClass('pe_none compare_add').addClass('cpt4_added').find('.tt_txt').text(txt_view);
        $('.compare_add[data-id="'+dt_id+'"]').removeClass('pe_none compare_add').addClass('cpt4_added').find('.tt_txt').text(txt_view);
        geckoShopify.wishlistUpdate(1);
        geckoShopify.compareUpdate(1);

      });

      // triger click
      body.on('click', '.cpt4_added,.js_link_cp', function (e) {
         e.preventDefault();
         // console.log('cpt4_added');
        $ld.trigger( "ld_bar_star" );
        setTimeout(function(){ $ld.trigger( "ld_bar_end" ); }, 300);
        window.location.href = cp_ntjs.attr('href');
      });

      // remove compare
      body.on('click', '.cpt4_remve', function (e) {
        e.preventDefault();
        var _this = $(this),
            id = 'id:'+_this.data('id'),
            ls = localStorage.getItem('nt_cp');

        _this.addClass('pe_none');
        var arrls = ls.split(','),
            index = arrls.indexOf(id);
            // console.log(arrls);
          if (index > -1) {
            arrls = arrls.splice(0,limit+1);
            arrls.splice(index, 1);
          } else {
            arrls = arrls.splice(0,limit);
          }
          // console.log(arrls);
          localStorage.setItem('nt_cp', arrls.toString());
           _this.removeClass('pe_none');
           $('.compare_id_'+_this.data('id')).remove();
           geckoShopify.compareUpdate(1);
           if (arrls.toString() == '') {
             window.location.href = cp_ntjs.attr('href');
           }
      });


    };
    
    geckoShopify.wishlistApp = function () {
      if (!sp_nt_storage || nt_settings.wishlist_type != '2' ) return;

      // customer not login trigger click popup if has
      body.on('click', '.nt_w_login', function (e) {
        //console.log('aaa')
        var _id_lg = $('[data-id="#nt_login_canvas"]');
         //console.log(_id_lg)
        if ( _id_lg.length == 0 ) return;
        e.preventDefault();
        _id_lg.first().trigger('click');
      });

       if ( wis_ntjs.length == 0 ) return;
       var cusid = wis_ntjs.data('cusid'),
           email = wis_ntjs.data('email'),
           txt_view = wis_ntjs.find('.txt_view').text(),
           arr_wis_id = $('#arr_wis_id'),
           limit = 80;

      // add wishlist
      body.on('click', '.wishlistadd', function (e) {
        e.preventDefault();
        var _this = $(this),
            dt_id = _this.data('id') || '',
            id = 'id:'+dt_id;
        
        if (id.length < 6) return;
        _this.addClass('loading');
        $.ajax({
          url: 'https://nitro-wishlist.teathemes.net?shop=' + Shopify.shop,
          type: 'POST',
          cache: true,
          data: {id: id, handle: "ntt4", action: "add", email: email, customer_id: cusid},
          success: function (data, status) {
             try {data = $.parseJSON(data);} catch (ex) {}
             if (data.status == 'success' && status == 'success') {
                //_this.removeClass('wishlistadd').addClass('wis_added').find('.tt_txt').text(txt_view);
               var txt_wis_id = arr_wis_id.text();
                $('.wishlistadd[data-id="'+dt_id+'"]').removeClass('pe_none wishlistadd').addClass(cl_w1).find('.tt_txt').text(txt_view);
                if (txt_wis_id == '') {
                  arr_wis_id.text(id);
                } else {
                  arr_wis_id.text(txt_wis_id +' '+id);
                }
                geckoShopify.wishlistUpdateApp(1);
             } else {
                console.log('Error: ' + data.message);
             }
          },
          error: function (data) {
             if (data.status == 404) {
                alert('This feature is not available because there is no  Nitro Wishlist app installed. Please install Nitro Wishlist app first when using Wishlist in Shop.');
             } else {
              console.log('Error: ' + data.message);
             }
          },
          complete: function() {
               _this.removeClass('loading');
          }
        });
      });

      // triger click
      body.on('click', '.wis_added,.js_link_wis', function (e) {
        e.preventDefault();
        if (wis_atc_added == '2') return;
        // console.log('wis_added');
        $ld.trigger( "ld_bar_star" );
        setTimeout(function(){ $ld.trigger( "ld_bar_end" ); }, 300);
        window.location.href = wis_ntjs.attr('href');
      });

      // remove wishlist
      body.on('click', cl_w2, function (e) {
        e.preventDefault();
        var _this = $(this),
            id = _this.data('id'),
            un_wis_added = !_this.hasClass('wis_added');

        _this.addClass('loading');
        $.ajax({
          url: 'https://nitro-wishlist.teathemes.net?shop=' + Shopify.shop,
          type: 'POST',
          data: {id: id, handle: "ntt4", action: "remove", email: email, customer_id: cusid},
          success: function (data, status) {
             try {data = $.parseJSON(data);} catch (ex) {}

             if (data.status == 'success' && status == 'success') {
                if (un_wis_added) {
                  _this.closest('.nt_pr').remove();
                } else {
                  // update when remove wislist on quickview
                  $('.wis_added[data-id="'+id+'"]').removeClass('wis_remve wis_added').addClass('wishlistadd').find('.tt_txt').text(txt_add);
                }
                _this.removeClass('wis_remve wis_added').addClass('wishlistadd');
                var txt_arr = arr_wis_id.text(),
                    last_txt = txt_arr.replace("id:"+id,"").replace(" "+id,"").replace(id,"");
              
               // console.log('asdasdas');
               //console.log('last_txt', last_txt);
               if ($.trim(last_txt).length == 0) {
                 arr_wis_id.text(last_txt);
                 if (un_wis_added) {
                   window.location.href = wis_ntjs.attr('href').split('&q=')[0];
                 }
               } else {
                 arr_wis_id.text(last_txt);
                 geckoShopify.wishlistUpdateApp(1);
               }
             } else {
                console.log('Error: ' + data.message);
             }
          },
          error: function () {
            console.log('Error: ' + data.message);
          },
          complete: function() {
            _this.removeClass('loading');
          }
        });
      });

    };

    geckoShopify.mobileNav = function () {

      //var mobileNav = $("#nt_menu_canvas,#nav_header7,.js_opend_nav_nt");
      var mobileNav = $("#nt_menu_canvas,#nav_header7");

      mobileNav.on("click", ".menu-item-has-children.only_icon_false>a", function (e) {
        e.preventDefault();
        e.stopPropagation();

        var _this = $(this), _parent = _this.parent();
        ClickToActive(_this, _parent);

      });

      mobileNav.on("click", ".menu-item-has-children .nav_link_icon", function (e) {
        e.preventDefault();
        e.stopPropagation();

        var _this = $(this), _parent = _this.parent().parent();
        ClickToActive(_this, _parent);

      });

      var ClickToActive = function (_this,_parent) {

        if (_parent.hasClass("nt_opended")) {
         _parent.removeClass("nt_opended").children("ul").slideUp(200);
        } else {
          _parent.addClass("nt_opended").children("ul").slideDown(200);
        }
      };

      mobileNav.on('click', '.mb_nav_tabs>div', function () {
        if ($(this).hasClass('active')) return;

        var _this = $(this), menuID = _this.data('id');
        _this.parent().find('.active').removeClass('active');
        _this.addClass('active');
        $('.mb_nav_tab').removeClass('active');
        $(menuID).addClass('active');
      });

    };

    // slider video
    // geckoShopify.InitSliderVideo = function () {
    //   if ($('.slideshow_has_video').length == 0 || !Modernizr.video ) return;
    //   $('.slideshow_has_video').each(function( index ) {
    //     //console.log( index + ": " + $( this ).text() );
    //     var _this = $(this);
    //     _this.on( 'select.flickity', function( e, index ) {
    //       var currentSlide = _this.find('.slideshow__slide').eq(index),
    //           vid = $("#video_"+currentSlide.data('id'))[0],
    //           vid_nt = _this.find('.vid_nt');

    //       if (vid.length == 0) return;
    //       //console.log(vid);
    //       //console.log(vid_nt);
    //       if ( currentSlide.hasClass('has_video')) {
    //         vid.play();
    //       } else {
    //         vid_nt.each(function() {
    //             $(this).get(0).pause();
    //         });
    //       }
    //     });
    //   });
    // };
    
    // video html5
    // geckoShopify.InitHTMLVideo = function () {
    //   //https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
    //   if ($('.vid_nt_js').length == 0 || !Modernizr.video) return;
     
    //   $('.vid_nt_js').each(function() {
    //      var _this = $(this),
    //          _img = _this.parent().find('.img_vid_js');
    //     _this.addClass('lazyload');
    //       _this.on('lazyloaded', function() {
    //         _this[0].play();
    //         _this.addClass('vid_ready'); 
    //         _img.addClass('lazyload');
    //       });

    //       _this.on('playing', function() {
    //         _img.remove();
    //       });
    //     // _this.on('loadeddata', function() {
          
    //     //   if(_this[0].readyState >= 2) {
    //     //     console.log(' loaded vid ');
    //     //     _this.addClass('vid_ready')
    //     //     if (_this.hasClass('vid_bg')) {
    //     //       _this[0].play();
    //     //     }
    //     //   }

    //     // });
    //     // _this.one('play', function() {
    //     //   // console.log(' play vid ');
    //     //    _this.addClass('vid_ready')
    //     // });
        
    //   });
    // };

    // Open video in popup
    geckoShopify.InitPopupVideo = function () {
      if ($('.nt_mfp_video').length == 0) return;

      $('.nt_mfp_video').magnificPopup({
         disableOn: 0,
         type: 'iframe',
         tClose: nt_settings.close,
         iframe: {
            markup: '<div class="mfp-iframe-scaler pr">'+
                  '<div class="mfp-close"></div>'+
                  '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                '</div>', // HTML markup of popup, `mfp-close` will be replaced by the close button

            patterns: {
                youtube: {
                  index: 'youtube.com/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).
                  id: 'v=',
                  src: '//www.youtube.com/embed/%id%?autoplay=1' // URL that will be set as a source for iframe.
                },
                vimeo: {
                  index: 'vimeo.com/',
                  id: '/',
                  src: '//player.vimeo.com/video/%id%?autoplay=1'
                }
            },
            srcAction: 'iframe_src', // Templating object key. First part defines CSS selector, second attribute. "iframe_src" means: find "iframe" and set attribute "src".
         }
      });
    };

    // Open HTML in popup
    geckoShopify.InitPopupHTML = function () {
      if ($('.nt_mfp_html').length == 0) return;

      body.on('click', '.nt_mfp_html', function (e) {
          $.magnificPopup.open({
            items: {
              src: $(this).data('mfp')
            },
            type: 'iframe'
          });

        return false; //for good measure
        e.preventDefault();
        e.stopPropagation();
      });
    };
    
    geckoShopify.preloadImages = function(arrayOfImages) {
        $(arrayOfImages).each(function(){
            $('<img/>')[0].src = this;
            // Alternatively you could use:
            // (new Image()).src = this;
        });
    };

    // 360 video 
    geckoShopify.Init360Video = function () {
      if ($('.nt_mfp_360').length == 0) return;

      var threesixty,pr_id;

      $('.nt_mfp_360').magnificPopup({
          items: {
            src: '#pr_360_mfp'
          },
         type: 'inline',
         tClose: nt_settings.close,
         mainClass: 'mfp-fade',
         removalDelay: 160,
         disableOn: false,
         preloader: false,
         fixedContentPos: false,
         callbacks: {
           beforeOpen: function() {},
           open: function () {
            //console.log(this.st.el);
            //geckoShopify.preloadImages(NTsettingspr.imgArray);
            if ($('.threesixty.doned').length > 0) return;

              var NTsettingspr = JSON.parse($('#NTsettingspr__ppr').html());
                 pr_id = NTsettingspr.ProductID;
              threesixty = $('.threed_id_'+pr_id).ThreeSixty({
                  totalFrames: NTsettingspr.totalFrames,
                  endFrame: NTsettingspr.endFrame,
                  currentFrame: 1,
                  framerate: NTsettingspr.framerate,
                  autoplayDirection: NTsettingspr.autoplayDirection,
                  imgList: ".threesixty_imgs",
                  progress: ".spinner",
                  imgArray: NTsettingspr.imgArray,
                  height: NTsettingspr.height,  
                  width: NTsettingspr.width,
                  responsive: true,
                  navigation: true
              });
              $('.threed_id_'+pr_id).addClass('doned');
            },
            beforeClose: function () {
              threesixty.stop();
              $('.nav_bar_stop').removeClass("nav_bar_stop").addClass("nav_bar_play");
            },
            close: function () {}
         },

      });

    };
         
    geckoShopify.add_loading = function () {
      body.on('click', '.js_add_ld:not(.jscl_ld)', function(e) {
         //$(this).addClass('jscl_ld');

          $ld.trigger( "ld_bar_star" );
          setTimeout(function(){ $ld.trigger( "ld_bar_60" ) }, 250);
          setTimeout(function(){ $ld.trigger( "ld_bar_80" ) }, 300);
          setTimeout(function(){ $ld.trigger( "ld_bar_90" ) }, 400);
          setTimeout(function(){ $ld.trigger( "ld_bar_94" ) }, 500);
          setTimeout(function(){ $ld.trigger( "ld_bar_end" ) }, 1000);
      });
    };

    geckoShopify.footerCollapse = function () {
        if ( $(window).width() > 767 || $('.footer_collapse_true').length == 0 ) return;

        $('.footer_collapse_true .widget-title').off('click').on('click', function () {
          var $title = $(this);
          var $widget = $title.parent();
          var $content = $widget.find('> .widget_footer');

          if ($widget.hasClass('footer_opened')) {
            $widget.removeClass('footer_opened');
            $content.stop().slideUp(200);
          } else {
            $widget.addClass('footer_opened');
            $content.stop().slideDown(200);
          }
        });

    };


    geckoShopify.backToTop = function () {
      var el = $('#nt_backtop');
      if ( ( $(window).width() < 768 && nt_settings.backtop !='3' ) || el.length == 0 ) return;

      // $(window).scroll(function () {
      //     if ($(this).scrollTop() > nt_settings.scrollTop) {
      //         el.addClass('bkt_show');
      //     } else {
      //         el.removeClass('bkt_show');
      //     }
      // });


      var debounce_timer;
      $(window).scroll(function() {
        if(debounce_timer) {window.clearTimeout(debounce_timer);}
     
        debounce_timer = window.setTimeout(function() {
          if ($(this).scrollTop() > nt_settings.scrollTop) {
              el.addClass('bkt_show');
          } else {
              el.removeClass('bkt_show');
          }
        }, 40);
     });

      //Click event to scroll to top
      el.on('click', function () {
          $('html, body').animate({
              scrollTop: 0
          }, 800);
          return false;
      });
    };

    geckoShopify.currencyForm = function () {

      if ( $('#CurrencyLangSelector').length == 0 ) return;


       function _submitFormCurrencyLang(value,disclosureInput) {
          $(disclosureInput).val(value);
          $('#CurrencyLangSelector').submit();
       };

       if ($('#CurrencySelector').length > 0) {
           var _Selector = '.languages a.lang-item,.currencies a.currency-item';
       } else {
           var _Selector = '.languages a.lang-item';
       }
       
        body.on("click",_Selector,function(e) {

           e.preventDefault();
           var $this = $(this);
           if ($this.hasClass('selected')) return;

           if ($this.hasClass('lang-item')) {
             var _parent = '.languages',
                 _child = '.languages .lang-item',
                 _input = '#LocaleSelector';

           } else {
             var _parent = '.currencies',
                 _child = '.currencies .currency-item',
                 _input = '#CurrencySelector';
           }
          
          var newCurrency = $this.attr('data-currency'),
              oldCurrency = $(_parent+' a.selected').first().attr("data-currency") || t_shop_currency;
          $(_parent+' .current').text($this.text()).removeClass('flagst4-'+oldCurrency).addClass('flagst4-'+newCurrency);
          $(_child).removeClass('selected');
          $(_parent+' a[data-currency=' + newCurrency + ']').addClass('selected');
          _submitFormCurrencyLang(newCurrency,_input);
          $ld.trigger( "ld_bar_star" );
          setTimeout(function(){ $ld.trigger( "ld_bar_60" ) }, 250);
          setTimeout(function(){ $ld.trigger( "ld_bar_80" ) }, 300);
          setTimeout(function(){ $ld.trigger( "ld_bar_90" ) }, 380);
          setTimeout(function(){ $ld.trigger( "ld_bar_94" ) }, 500);
          setTimeout(function(){ $ld.trigger( "ld_bar_end" ) }, 1000);

        });
       
       var StorageCurrency = geckoShopify.StorageCurrency();
       if (!nt_settings.currency_visitor || StorageCurrency != null || navigator.userAgent.match(/bot|spider/i) ) return;

        var currencyUpdate = function (currency) {
          if (sp_nt_storage) {localStorage.setItem('T4Currency', currency)}
          $('.currencies a[data-currency="'+currency+'"]:first').trigger('click');
        };
       var arrayCurrency ={AF:"AFN",AX:"EUR",AL:"ALL",DZ:"DZD",AS:"USD",AD:"EUR",AO:"AOA",AI:"XCD",AQ:"",AG:"XCD",AR:"ARS",AM:"AMD",AW:"AWG",AU:"AUD",AT:"EUR",AZ:"AZN",BS:"BSD",BH:"BHD",BD:"BDT",BB:"BBD",BY:"BYN",BE:"EUR",BZ:"BZD",BJ:"XOF",BM:"BMD",BT:"BTN",BO:"BOB",BA:"BAM",BW:"BWP",BV:"NOK",BR:"BRL",IO:"USD",BN:"BND",BG:"BGN",BF:"XOF",BI:"BIF",KH:"KHR",CM:"XAF",CA:"CAD",CV:"CVE",KY:"KYD",CF:"XAF",TD:"XAF",CL:"CLP",CN:"CNY",CX:"AUD",CC:"AUD",CO:"COP",KM:"KMF",CG:"XAF",CD:"CDF",CK:"NZD",CR:"CRC",CI:"XOF",HR:"HRK",CU:"CUP",CY:"EUR",CZ:"CZK",DK:"DKK",DJ:"DJF",DM:"XCD",DO:"DOP",EC:"USD",EG:"EGP",SV:"USD",GQ:"XAF",ER:"ERN",EE:"EUR",ET:"ETB",FK:"FKP",FO:"DKK",FJ:"FJD",FI:"EUR",FR:"EUR",GF:"EUR",PF:"XPF",TF:"EUR",GA:"XAF",GM:"GMD",GE:"GEL",DE:"EUR",GH:"GHS",GI:"GIP",GR:"EUR",GL:"DKK",GD:"XCD",GP:"EUR",GU:"USD",GT:"GTQ",GG:"GBP",GN:"GNF",GW:"XOF",GY:"GYD",HT:"HTG",HM:"AUD",VA:"EUR",HN:"HNL",HK:"HKD",HU:"HUF",IS:"ISK",IN:"INR",ID:"IDR",IR:"IRR",IQ:"IQD",IE:"EUR",IM:"GBP",IL:"ILS",IT:"EUR",JM:"JMD",JP:"JPY",JE:"GBP",JO:"JOD",KZ:"KZT",KE:"KES",KI:"AUD",KR:"KRW",KW:"KWD",KG:"KGS",LA:"LAK",LV:"EUR",LB:"LBP",LS:"LSL",LR:"LRD",LY:"LYD",LI:"CHF",LT:"EUR",LU:"EUR",MO:"MOP",MK:"MKD",MG:"MGA",MW:"MWK",MY:"MYR",MV:"MVR",ML:"XOF",MT:"EUR",MH:"USD",MQ:"EUR",MR:"MRU",MU:"MUR",YT:"EUR",MX:"MXN",FM:"USD",MD:"MDL",MC:"EUR",MN:"MNT",ME:"EUR",MS:"XCD",MA:"MAD",MZ:"MZN",MM:"MMK",NA:"NAD",NR:"AUD",NP:"NPR",NL:"EUR",AN:"",NC:"XPF",NZ:"NZD",NI:"NIO",NE:"XOF",NG:"NGN",NU:"NZD",NF:"AUD",MP:"USD",NO:"NOK",OM:"OMR",PK:"PKR",PW:"USD",PS:"ILS",PA:"PAB",PG:"PGK",PY:"PYG",PE:"PEN",PH:"PHP",PN:"NZD",PL:"PLN",PT:"EUR",PR:"USD",QA:"QAR",RE:"EUR",RO:"RON",RU:"RUB",RW:"RWF",BL:"EUR",SH:"SHP",KN:"XCD",LC:"XCD",MF:"EUR",PM:"EUR",VC:"XCD",WS:"WST",SM:"EUR",ST:"STN",SA:"SAR",SN:"XOF",RS:"RSD",SC:"SCR",SL:"SLL",SG:"SGD",SK:"EUR",SI:"EUR",SB:"SBD",SO:"SOS",ZA:"ZAR",GS:"GBP",ES:"EUR",LK:"LKR",SD:"SDG",SR:"SRD",SJ:"NOK",SZ:"SZL",SE:"SEK",CH:"CHF",SY:"SYP",TW:"TWD",TJ:"TJS",TZ:"TZS",TH:"THB",TL:"USD",TG:"XOF",TK:"NZD",TO:"TOP",TT:"TTD",TN:"TND",TR:"TRY",TM:"TMT",TC:"USD",TV:"AUD",UG:"UGX",UA:"UAH",AE:"AED",GB:"GBP",US:"USD",UM:"USD",UY:"UYU",UZ:"UZS",VU:"VUV",VE:"VEF",VN:"VND",VG:"USD",VI:"USD",WF:"XPF",EH:"MAD",YE:"YER",ZM:"ZMW",ZW:"ZWD"};    
       
       if (nt_currency) {
          var data = JSON.parse(nt_currency),currency;
              try {
                 currency = data.currency.handle
              }
              catch(err) {
                 currency = arrayCurrency[data.countryCode] || arrayCurrency[data.country] || data.currency;
              }
          currencyUpdate(currency);
       } else {

          var params = {
             type: 'get',
             url: 'https://extreme-ip-lookup.com/json',
             dataType: "json",
             success: function (data) {
                if (data.status == "success") {
                  if (sp_nt_storage) { localStorage.setItem('nt_currency', JSON.stringify(data))}
                  currencyUpdate(arrayCurrency[data.countryCode]);
                } else {
                  $.ajax(params_2)
                }
             },
             error: function (XMLHttpRequest, textStatus) {
                $.ajax(params_2)
             }
          };

          var params_2 = {
             type: 'get',
             url: 'https://ipinfo.io/json',
             dataType: "json",
             success: function (data) {
                if (sp_nt_storage) { localStorage.setItem('nt_currency', JSON.stringify(data))}
                currencyUpdate(arrayCurrency[data.country]);
             }
          };
          
          $.ajax({
             type: 'get',
             url: '/browsing_context_suggestions.json?source=geolocation_recommendation&currency[enabled]=true&language[enabled]=true',
             dataType: "json",
             success: function (data) {
              try {
                 var arrSuggest = data.suggestions[0].parts;
                 if (sp_nt_storage) { localStorage.setItem('nt_currency', JSON.stringify(arrSuggest))}
                 currencyUpdate(arrSuggest.currency.handle);
              }
              catch(err) {
                $.ajax(params)
              }
             },
             error: function (XMLHttpRequest, textStatus) {
                $.ajax(params)
             }
          });

        }
      };

      geckoShopify.stickyFooter = function () {

        if ($('.footer_sticky_true').length == 0 || $(window).width() <= 1024) return;
          var $footer = $('#nt_footer'),
            $page = $('#nt_content'),
            $window = $(window);

          if ($('.kalles_prefooter').length > 0) {
            $page = $('.kalles_prefooter');
          }

          var footerOffset = function () {
            $page.css({
              marginBottom: $footer.outerHeight()
            });
          };

          $window.on('resize', footerOffset);

          footerOffset();
          body.addClass('calc_footer_sticky');

          //Safari fix
          if (!$('html').hasClass('browser-Safari')) return;
          var footerSafariFix = function () {
            //if (!$('html').hasClass('browser-Safari')) return;
            var windowScroll = $window.scrollTop();
            var footerOffsetTop = $(document).outerHeight() - $footer.outerHeight();

            if (footerOffsetTop < windowScroll + $footer.outerHeight() + $window.outerHeight()) {
              $footer.addClass('visible_footer');
            } else {
              $footer.removeClass('visible_footer');
            }
          };

          footerSafariFix();
          $window.on('scroll', footerSafariFix);
      };


      geckoShopify.NewsletterPopup = function () {

        if ($('.popup_new_wrap').length == 0 || ($('.mobile_new_false').length > 0 && $(window).width() < 768) || (Cookies.get('kalles_age_verify') != 'confirmed' && $('.popup_age_wrap').length > 0) ) return;
        var popup = $('.popup_new_wrap'),
          stt = popup.data('stt'),
          pp_version = stt.pp_version,
          shown = false,
          pages = Cookies.get('kalles_shown_pages');

          var showPopup = function () {
            $.magnificPopup.open({
              items: {
                src: '#shopify-section-newsletter_pp .popup_new_wrap'
              },
              type: 'inline',
              removalDelay: 500, //delay removal by X to allow out-animation
              tClose: nt_settings.close,
              callbacks: {
                beforeOpen: function () {
                  this.st.mainClass ='mfp-move-horizontal new_pp_wrapper';
                },
                open: function () {
                  // Will fire when this exact popup is opened
                  // this - is Magnific Popup object
                },
                close: function () {
                  $(".qs_opened").removeClass("qs_opened");
                  Cookies.set('kalles_popup_' + pp_version, 'shown', { expires: stt.day_next, path: '/' });
                }
                // e.t.c.
              }
            });
          };

          var showPopup2 = function () {
              if ($.magnificPopup.instance.isOpen) {
                 $.magnificPopup.close();
                 setTimeout(function(){ showPopup(); }, $.magnificPopup.instance.st.removalDelay+10);
              } else {
                showPopup();
              }
              // if ($('.mfp-content').length > 0 ) {
              //   $.magnificPopup.close();
              //   setTimeout(function(){ showPopup(); }, 555);
              // } else {
              //   showPopup();
              // }
          };

          $('.kalles_open_newsletter').on('click', function (e) {
            e.preventDefault();
            showPopup2();
          });

          popup.on('open_newsletter', function () {
            showPopup2();
          });
          //$('.popup_new_wrap').trigger('open_newsletter');
          
          if (designMode) return;

          if (!pages) pages = 0;
          // console.log(pages);
          // console.log(stt.number_pages);
          if (pages < stt.number_pages) {
            pages++;
            Cookies.set('kalles_shown_pages', pages, { expires: stt.day_next, path: '/' });
            return false;
          }

          if (Cookies.get('kalles_popup_' + pp_version) != 'shown') {
            if (stt.after == 'scroll') {
              $(window).scroll(function () {
                if (shown) return false;
                if ($(document).scrollTop() >= stt.scroll_delay) {
                  showPopup2();
                  shown = true;
                }
              });
            } else {
              setTimeout(function () {
                showPopup2();
              }, stt.time_delay);
            }
          }
      };

      // Age verify.
      geckoShopify.ageVerify = function () {
          if ( $('.popup_age_wrap').length == 0 || ( !designMode && Cookies.get('kalles_age_verify') == 'confirmed') ) return;

          var popup = $('.popup_age_wrap'),
          stt = popup.data('stt'),
          age_limit = stt.age_limit,
          date_of_birth = stt.date_of_birth,
          day_next = stt.day_next;

          var showPopup = function () {
            $.magnificPopup.open({
              items: {
                src: '#shopify-section-age_verify .popup_age_wrap'
              },
              type: 'inline',
              closeOnBgClick: false,
              closeBtnInside: false,
              showCloseBtn: false,
              enableEscapeKey: false,
              removalDelay: 500,
              tClose: nt_settings.close,
              callbacks: {
                beforeOpen: function () {
                  this.st.mainClass ='mfp-move-horizontal age_pp_wrapper';
                },
              }
            });
          };

          if (!designMode) {
            showPopup();
          }
          popup.on('open_age_pp', function () {
            //$.magnificPopup.close();
            showPopup();
          })
          //$('.popup_age_wrap').trigger('open_age_pp');

          $('.age_verify_allowed').on('click', function(){

            if (date_of_birth) {
               var year =  parseInt($('#ageyear').val()),
                   month = parseInt($('#agemonth').val()),
                   day =   parseInt($('#ageday').val()),
                   theirDate = new Date((year + age_limit), month, day),
                   today = new Date;

               if ((today.getTime() - theirDate.getTime()) < 0) {
                 popup.addClass('animated shake');
                  window.setTimeout(function(){
                    popup.removeClass('animated shake');
                  }, 1000);
               } else {
                Cookies.set('kalles_age_verify', 'confirmed', { expires: parseInt( day_next ), path: '/' });
                $.magnificPopup.close();
               }
            } else {
              Cookies.set('kalles_age_verify', 'confirmed', { expires: parseInt( day_next ), path: '/' });
              $.magnificPopup.close();
            }

          });

          $('.age_verify_forbidden').on('click', function(){
            popup.addClass('active_forbidden');
          });
      };

      // Cookies law.
      geckoShopify.cookiesLawPP = function () {

        var popup = $('.popup_cookies_wrap'),
            popup_parent = popup.parent(),
            stt = popup.data('stt');
            try {
              var pp_version = stt.pp_version;
            }
            catch(err) {
              var pp_version = 1994;
            }
        if ( (!designMode && Cookies.get('kalles_cookies_' + pp_version) == 'accepted') || popup.length == 0 ) return;
        
        var showPopup = function () {
          popup_parent.removeClass('pp_onhide').addClass('pp_onshow');
          popup.on('click', '.pp_cookies_accept_btn', function (e) {
            e.preventDefault();
            acceptCookies();
          });
        };

        if (!designMode) {
          setTimeout(function () {
          showPopup();
          }, 2500);
        }

        popup.on('open_cookies_pp', function () {
          showPopup();
        })
        //$('.popup_cookies_wrap').trigger('open_cookies_pp');

        var acceptCookies = function () {
          popup_parent.removeClass('pp_onshow').addClass('pp_onhide');
          Cookies.set('kalles_cookies_' + pp_version, 'accepted', { expires: stt.day_next, path: '/' });
        };

      };

      geckoShopify.PromoPrPopup = function () {
        var pp_version = 1;
        if ($('.js_lz_pppr').length == 0 || window_w < 1025 || !yesHover || (Cookies.get('kalles_age_verify') != 'confirmed' && $('.popup_age_wrap').length > 0) || (!designMode && Cookies.get('kalles_prpr_pp_' + pp_version) == 'shown')) return;

          var popup = $('.popup_prpr_wrap');
          var showPopup = function () {
            var stt = $('.popup_prpr_wrap').data('stt');
            $.magnificPopup.open({
              items: {
                src: '#shopify-section-promo_pr_pp .popup_prpr_wrap'
              },
              type: 'inline',
              removalDelay: 500, //delay removal by X to allow out-animation
              tClose: nt_settings.close,
              callbacks: {
                beforeOpen: function () {
                  this.st.mainClass ='mfp-move-horizontal prpr_pp_wrapper';
                },
                open:function () {
                  var $el = $('.popup_prpr_wrap .js_carousel');
                  geckoShopify.refresh_flickity($el);
                  geckoShopify.flickityResposition(false,$el);
                  $('.popup_prpr_wrap .swatch__list--calced').removeClass('swatch__list--calced');
                  geckoShopify.recalculateSwatches();
                  geckoShopify.InitCountdown();
                  geckoShopify.lazyWishUpdate();
                  geckoShopify.review();
                  body.trigger('refresh_currency');
                  $(document).off('mouseleave.registerexit');
                  // Will fire when this exact popup is opened
                  // this - is Magnific Popup object
                },
                close:function () {
                    $(".qs_opened").removeClass("qs_opened");
                    Cookies.set('kalles_prpr_pp_' + pp_version, 'shown', { expires: stt.day_next, path: '/' });
                }
                // e.t.c.
              }
            });
          };

          $('.kalles_open_promopr').on('click', function (e) {
            e.preventDefault();
            showPopup();
          });

          popup.on('open_promopr', function () {
            showPopup();
          });
          //$('.popup_prpr_wrap').trigger('open_promopr');
          
          if (designMode ) return;
          
          $('.js_lz_pppr.dn').removeClass('dn').addClass('lazyload lazypreload');
          // Detect exit
          $(document).on('mouseleave.registerexit', function(e){
            if ( e.clientY < 60 && $('.mfp-content').length == 0 && $('.popup_prpr_wrap').length > 0){
                //console.log(e);
                showPopup();
            }
          });
      };

      geckoShopify.SalesPopup = function () {

        if ($('.popup_slpr_wrap').length == 0 || ($('.salse_pp_mb_false').length > 0 && $(window).width() < 768) || (Cookies.get('kalles_age_verify') != 'confirmed' && $('.popup_age_wrap').length > 0)) return;
        
          var popup = $('.popup_slpr_wrap'),
              stt = popup.data('stt'),
              show = stt.show,
              limit = stt.limit - 1,
              pp_type = stt.pp_type, 
              catLink = stt.catlink,
              arrTitle = JSON.parse($('#title_sale_pp').html()),
              arrUrl = stt.url,
              arrImage = stt.image,
              arrID = stt.id,
              arrLocation = JSON.parse($('#location_sale_pp').html()),
              arrTime = JSON.parse($('#time_sale_pp').html()),
              ClassUp = stt.ClassUp,
              ClassDown = stt.classDown[ClassUp],
              StarTimeout,StayTimeout,

              slpr_img = $('.js_slpr_img'),
              slpr_a = $('.js_slpr_a'),
              slpr_tt = $('.js_slpr_tt'),
              slpr_location = $('.js_slpr_location'),
              slpr_ago = $('.js_slpr_ago'),
              slpr_qv = $('.pp_slpr_qv'),
             
              index = 0,
              min = 0,
              max = arrUrl.length - 1,
              max2 = arrLocation.length - 1,
              max3 = arrTime.length - 1,
              StarTime = stt.StarTime * stt.StarTime_unit,
              StayTime = stt.StayTime * stt.StayTime_unit;

          //console.log(show[t_name]);
          //if (! show[t_name]) return;
          
          var Updatedata = function (index) {

            // update img 
            var img = arrImage[index],
                 img_url = img.replace(".jpg?v=", "_65x.jpg?v=").replace(".png?v=", "_65x.png?v=").replace(".gif?v=", "_65x.gif?v="),
                 img_url2 = img.replace(".jpg?v=", "_130x.jpg?v=").replace(".png?v=", "_130x.png?v=").replace(".gif?v=", "_130x.gif?v=");
            slpr_img.attr('src',img_url).attr('srcset',img_url+' 1x,'+img_url2+' 2x');

            // update title
            slpr_tt.text(arrTitle[index]);

            // update link
            slpr_a.attr('href',arrUrl[index]);

            // update id quick view
            slpr_qv.attr('data-id',arrID[index]);

            // update location
            slpr_location.text(arrLocation[geckoShopify.getRandomInt(min, max2)]);

            // update time
            slpr_ago.text(arrTime[geckoShopify.getRandomInt(min, max3)]);
            
            showSlaesPopUp();
          };
          
          // Load sales popup
          var loadSalesPopup = function () {
            //if (nt_check) return;
              if (pp_type == '1') {
                Updatedata(index);
                ++index;
                if (index > limit || index > max) {index = 0} 

              } else {
               Updatedata(geckoShopify.getRandomInt(min, max));
              }

              StayTimeout = setTimeout(function() {
                  unloadSalesPopup();
              }, StayTime);
         };
         
         // unLoad sales popup
         var unloadSalesPopup = function () {
            hideSlaesPopUp();
            StarTimeout = setTimeout(function(){

               //console.log('Timeout loadSalesPopup');
               loadSalesPopup();

            }, StarTime);
         };
         //slideOutDown, fadeOut

         var showSlaesPopUp = function () {
           popup.removeClass('hide').addClass(ClassUp).removeClass(ClassDown); 
         };

         var hideSlaesPopUp = function () {
            popup.removeClass(ClassUp).addClass(ClassDown); 
         };

         $(".pp_slpr_close").on("click", function(e){
             e.preventDefault();
            hideSlaesPopUp();
            clearTimeout(StayTimeout);
            clearTimeout(StarTimeout);
         });

         popup.on('open_slpr_pp', function () {
            unloadSalesPopup();
         });
         //$('.popup_slpr_wrap').trigger('open_slpr_pp');

         if (designMode ) return;

         // Run unloadSalesPopup 
         unloadSalesPopup();

      };

      geckoShopify.MenuhoverIntent = function () {
        if( !yesHover ) return;
        
        var HoverInterval = nt_settings.HoverInterval,  // 20
            HoverTimeout = nt_settings.HoverTimeout; // 70

        $(".nt_menu li.has-children").each(function (e, i) {
          var _this = $(this)
          _this.hoverIntent({
              sensitivity: 3,
              interval: HoverInterval,
              timeout: HoverTimeout,
              over: function (t) {
                 _this.addClass("menu_item_hover");
              },
              out: function () {
                 _this.removeClass("menu_item_hover");
              },
          });
        });

      };


})( jQuery_T4NT );

jQuery_T4NT(document).ready(function($) {
  
  geckoShopify.MenuhoverIntent();
  geckoShopify.NewsletterPopup();
  geckoShopify.ageVerify();
  geckoShopify.cookiesLawPP();
  geckoShopify.PromoPrPopup();
  geckoShopify.stickyFooter();
  geckoShopify.swatchesOnBGGrid();
  geckoShopify.cartPosDropdown();
  geckoShopify.ideaIntent();
  geckoShopify.currencyForm();
  geckoShopify.popupMFP();
  geckoShopify.headerCategoriesMenu();
  geckoShopify.initQuickView();
  geckoShopify.quickShop();
  geckoShopify.InitPopupVideo();
  geckoShopify.InitPopupHTML();
  geckoShopify.Init360Video();
  geckoShopify.add_loading();
  geckoShopify.footerCollapse();
  geckoShopify.mobileNav();
  geckoShopify.backToTop();
  geckoShopify.wishlistLocal();
  geckoShopify.wishlistApp();
  geckoShopify.ThemeT4Compare();
  geckoShopify.wishlistUpdate(0);
  geckoShopify.wishlistUpdate(1);
  geckoShopify.compareUpdate(0);
  geckoShopify.compareUpdate(1);
  geckoShopify.wishlistUpdateApp(0);
  geckoShopify.wishlistUpdateApp(1);
  geckoShopify.lazyWishUpdate();
  //geckoShopify.InitSliderVideo();
  //geckoShopify.InitHTMLVideo();
  
  // $('.js_lz_slpr.dn').removeClass('dn').addClass('lazyload lazypreload').one('lazyincluded', function(e) {
  $('.js_lz_slpr.dn').removeClass('dn').addClass('lazyload').one('lazyincluded', function(e) {
        //console.log('ttt2');
        geckoShopify.SalesPopup();
  });

  if ( designMode) {
    geckoShopify.SalesPopup();
  }

  if (JSNTT4.data('cusjs') == 'none') return;
  $script(JSNTT4.data('cusjs'));
});