var geckoShopify,ThemeIdLoT4,
   sp_nt_storage = false, 
   Enablestorage = true, 
   tuttimer = []
try {
   sp_nt_storage = (typeof(Storage) !== "undefined" && Enablestorage);
   localStorage.setItem('gecko', 'test'); localStorage.removeItem('gecko');
   ThemeIdLoT4 = localStorage.getItem(ThemeNameT42);
} catch (err) {
   sp_nt_storage = false;
}
var nt_currency = (sp_nt_storage) ? localStorage.getItem('nt_currency') : null, app_review = nt_settings.app_review;
//if (typeof Currency === 'undefined') { var Currency = {} }
// make Flickity a jQuery_T4NT plugin
// jQuery_T4NTBridget( 'flickity', Flickity, $ );
// jQuery_T4NTBridget( 'packery', Packery, $ );
// if (designMode) {
//    // make Flickity a jQuery_T4NT plugin
//   jQuery_T4NTBridget( 'flickity', Flickity, $ );
// }
(function( $ ) {
   "use strict";
   geckoShopify = (function() {
      var body = $('body'),
         _rtl = body.hasClass('rtl_true'),
         $ld = $('#ld_cl_bar'),
         window_w = $(window).width(),
         timezone = nt_settings.timezone,
         geckoTheme = {
            popupAnimation: 'mfp-move-horizontal',
            scrollSelector: '.shopify-error a[href^="#"], [data-js-scrolid]',
            nt_btn_load_more : '.load-on-scroll:not(.btn--loader-active)',
            url_currency : 'https://api.teathemes.net/currency',
            money_format : '${{amount}}'
      };
      return {
         init: function() {
            //this.initCarousel();
            this.hTransparent();
            this.bannerCountdown();
            this.The4WrappTable();
            //this.cartCountdown();
            this.InitCountdown();
            this.InitSeCountdown();
            this.fullHeightRow();
            //this.cartPosDropdown();
            this.parallax();
            // this.swatchesOnBGGrid();
            //this.initMegaMenu();
            //this.initStickyMenu();
            // this.ideaIntent();
            //this.lazyincluded();
            // this.cat_view();
            // this.loadMorePr();
            // this.catTabs();
            //this.scrollInfinite();
            // this.ajaxFilters();
            // this.popupMFP();
            // this.InitSidebarFilter();
            //this.mobileMenu();
            //this.SimpleBar();
            // this.catAccordion();
            this.prisotope();
            // this.productImages();
            // this.StickySidebar();
            this.ScrollId();
            //this.fakeDropdown();
            // this.initQuickView();
            // this.quickShop();
            // this.InitCountdown_pr('#nt_countdow_ppr');
            // this.delivery_order('#delivery_ppr');
            // this.real_time('#counter_ppr');
            // this.flashSold('#sold_ppr');
            // this.intThe4IP('#ship_ppr');
            // this.PrRecommendations();
            // this.recently_viewed();
            // this.InitPopupVideo();
            // this.Init360Video();
            //this.clickProduct();
            // this.spAccordion();
            // this.add_loading();
            // this.galleryPhotoSwipe();
            this.BGVideoSection();
            this.InitHTMLVideo();
            //this.FixHeight();
            //this.flickityFixscrollMobile();
            //this.hTransparent7();
            this.sidePopup();
            this.linkAcc();
            this.linktrigger();
            this.cartCookies();
            this.loadingBar();
            //this.LbScaleImg();
            // this.colorConsoleLog(nt_settings.theme_ver, "The4.co","#008060","#4959bd");
            $(window).resize();
            window.dispatchEvent(new Event('resize'));
           body.addClass('shopify-ready');
         },    

         // Check is mobile
         isMobile : function() {
            return (/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera);
         },

         colorConsoleLog: function(e, t, n, r) {
             if (nt_settings.disabled_ver_console) return;
             console.log("%c ".concat(e, " %c ").concat(t, " %c"), "background:".concat(n || "#35495f", " ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff"), "background:".concat(r || "#41b883", " ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff"), "background:transparent")
         },
         // initCarousel : function() {
         //    if (!designMode) return;
         //    $('.nt_carousel').each(function (index) {
         //       var el = $(this);
         //       geckoShopify.refresh_flickity(el);
         //    });
         // },

         // flickityFixscrollMobile : function() {
         //    $('.nt_slider').each(function (index) {
         //       var el = $(this);
         //       el.on( 'select.flickity', function( event, index ) {

         //          console.log( 'Flickity select ' + index );
         //          el.find(".banner:not(.is-selected) .video-bg").trigger("pause"),
         //          el.find(".banner.is-selected .video-bg").trigger("play")

         //       }).on( 'dragStart.flickity', function( event, index ) {

         //          console.log( 'Flickity dragStart ' + index );
         //          document.ontouchmove = function(t) {
         //              return t.preventDefault()
         //          }
         //          el.addClass("is-dragging");

         //       }).on( 'dragEnd.flickity', function( event, index ) {

         //          console.log( 'Flickity dragEnd ' + index );
         //          document.ontouchmove = function() {
         //              return !0
         //          }
         //          el.removeClass("is-dragging");

         //       });
         //    });
         // },

         prisotope : function() {
            if (!$('.p-thumb.only_owl_mb').length > 0 || window_w < 768 ) return;
            var el = $('.p-thumb.only_owl_mb'),option = el.attr("data-prmasonry");
            el.isotope(JSON.parse(option)).addClass('isotope_ok');
            $(window).on('resize', function () {
               if ($(window).width() < 768 && el.hasClass('isotope_ok') ) { el.isotope('destroy').removeClass('isotope_ok'); }
               else if ($(window).width() >= 768 && !el.hasClass('isotope_ok') ) { el.isotope(JSON.parse(option)).addClass('isotope_ok'); }
            });
            //$('.only_owl_mb.p-thumb').isotope({ filter: '.bc_red' });
         },


         sidePopup : function() {

            var mask = $('.mask-overlay'),
                classActive = 'act_current',
                act_opened = 'act_opened',
                html = $('html'),
                ModTouchevents = Modernizr.touchevents;

            body.on("click", ".push_side:not(."+classActive+")", function (e) {
               //console.log('click');
               var _this = $(this),
                   _id = _this.data('id'), 
                   $id = $(_id);
                
               if ( $id.length == 0 ) return;
               e.preventDefault();

               // if (_this.hasClass(classActive)) {
               //    closeMenu();
               // } else {
               //    closeMenu();
               //    openMenu(_this,_id,$id);
               // }
               closeMenu();
               if (!_this.hasClass(classActive)) { 

                  openMenu(_this,_id,$id);

                  // Close by esc
                  body.on('keyup', closeByEsc);

                  if ( _id == '#nt_search_canvas' && !ModTouchevents) {
                       // setTimeout(function () {
                       //   $id.find('input[type="text"]')[0].focus().select();
                       // }, 500);

                  $id.on('transitionend webkitTransitionEnd oTransitionEnd', function () {
                      $id.find('input[type="text"]').focus();
                  });
                  }
               }

            });
            
            // click touchstart
            body.on("click touchstart", ".mask-overlay", function (e) {
               // e.preventDefault();
               // e.stopPropagation();
               // console.log('dsfs');
               closeMenu();
            });

            body.on('click', '.close_pp, .push_side.'+classActive, function () {
              if ($('.'+act_opened).length == 0) return;
               closeMenu();
            });


            var closeByEsc = function (e) {
              if (e.keyCode === 27) {
                closeMenu();
                body.unbind('keyup', closeByEsc);
              }
            };

            function openMenu(_this,_id,$id) {
               // $('.push_side.'+classActive).removeClass(classActive);
               // $('.nt_fk_canvas.'+act_opened).removeClass(act_opened);
               _this.addClass(classActive);
               html.addClass('hside_opened');
               body.addClass('pside_opened');
               $id.addClass(act_opened);
               mask.addClass('mask_opened');
               // if (_id == '#nt_cart_canvas') {
               //    geckoShopify.cartCountdown();
               // }
               //lockBodyScroll();
            }

            function closeMenu() {
               $('.push_side.'+classActive).removeClass(classActive);
               html.removeClass('hside_opened');
               body.removeClass('pside_opened');
               $('.nt_fk_canvas.'+act_opened+',.nt_fk_full.'+act_opened).removeClass(act_opened);
               mask.removeClass('mask_opened');
               //unlockBodyScroll();
               //$('.mobile-nav .searchform input[type=text]').blur();
            }
           
           // var data_bodylock = '.fixcl-scroll-content';
           // function lockBodyScroll() {
           //   // Disable scroll except on the predictive search container.
           //   window.bodyScrollLock.disableBodyScroll(
           //     document.querySelector(data_bodylock),
           //     {
           //       allowTouchMove: function(element) {
           //         return (
           //           // If the touch event is in an element under the predictive search
           //           // we allow don't prevent default.
           //           $(element).parents(data_bodylock).length === 1
           //         );
           //       }
           //     }
           //   ); 
           // }

           // function unlockBodyScroll() {
           //   window.bodyScrollLock.clearAllBodyScrollLocks();
           // }

         },

         linkAcc : function() {
            var $id = $('#nt_login_canvas');
            if ($id.length == 0) return;
            $id.on("click", ".link_acc", function (e) {
               e.preventDefault();

               $('#nt_login_canvas .is_selected').removeClass('is_selected');
               $($(this).data('id')).addClass('is_selected');

            });
         },

         linktrigger : function() {
            var $id = $('.dt_trigger_cl');
            if ($id.length == 0) return;
            $id.click(function(e){
              e.preventDefault();
              $($(this).data('trigger')).trigger('click');
            });
         },
         
         // LookbookScaleImg
         LbScaleImg : function() {
            // add css style
            // .scalelb_calced .pin__maker {
            //     transform-origin: 0 0 0;
            //     -webkit-transform-origin: 0 0 0;
            //     -ms-transform-origin: 0 0 0;
            //     -o-transform-origin: 0 0 0;
            // }
            
            function ScaleImg() {
               $('.js_t4_lb,.pin__wr_js').each(function(index, element) {
                 
                  var _this = $(this),
                     lb_w = parseInt(_this.data('w')) || 0,
                     lb_h = parseInt(_this.data('h')) || 0,
                     pin__maker = _this.find('.pin__maker'),
                     pin__type = _this.find('.pin__type');

                  if(lb_w > 0 && _this.width() <= lb_w)
                  {      
                     var ratio = lb_w>0?pin__maker.width()/lb_w:1,
                          h_responsive = ratio * lb_h;

                     _this.addClass('scalelb_calced').css('max-height',h_responsive+'px');
                     pin__maker.css({ 'width':lb_w,'height':lb_h,'transform':'scale('+ratio+')' });
                     //pin__type.css('width',(32+32*ratio)+'px');

                  }
                  else
                  {
                     _this.removeClass('scaleimg_calced').css('max-height','');
                     pin__maker.css({ 'width':'','height':'','transform':'' });
                     //pin__type.css('width','');
                  }

               });
            }

            $(window).on('resize', function () {
                ScaleImg();
            });

            // $('.lookbook').css({'width':parseInt(ETS_LB_WIDTH_IMAGE)>0?ETS_LB_WIDTH_IMAGE:1170, 'height':parseInt(ETS_LB_HEIGHT_IMAGE)>0?ETS_LB_HEIGHT_IMAGE:450});
            // var objscale = $('.show-popup.active .lookbook-item-content').length > 0? $('.show-popup.active .lookbook-item-content'):$('.lookbook-item-content');
            // var ratio = (parseInt(ETS_LB_WIDTH_IMAGE)>0?objscale.width()/ETS_LB_WIDTH_IMAGE:1);
            // var height = ratio * ETS_LB_HEIGHT_IMAGE;
            // if(parseInt(ETS_LB_WIDTH_IMAGE) > 0 && objscale.width() <= ETS_LB_WIDTH_IMAGE)
            // {            
            //     objscale.css('height',height+'px');
            //     objscale.children('div.lookbook').css('transform', 'scale('+ratio+')');
            //     objscale.parent('.lookbook-item').parent().children('.product-list').css('max-height',height+'px');
            // }
            // else
            // {
            //     objscale.children('div.lookbook').css('transform', 'scale(1)');
            //     objscale.css('height','auto');
            // }

         },


         cookiesEnabled : function() {
            var cookieEnabled = navigator.cookieEnabled;

            if (!cookieEnabled){
             document.cookie = 'testcookie';
             cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
            }
            return cookieEnabled;
         },

         cartCookies : function() {
           if ( geckoShopify.cookiesEnabled() ) return;
           body.addClass('cart_no_cookies');
         },

         // initMegaMenu: function() {
         //    if( $(window).width() <= 1024 ) return;
         //    var $window = $(window),
         //            site_header = $('.header_inner'),
         //            MenuSection = $('.menu_section').find('ul.nt_menu'),
         //            Menuoffsets = MenuSection.find(' > li.menu_has_offsets');

         //        var calcOffset = function( li ) {
         //            var nav_dropdown = li.find(' > .nav_dropdown'),
         //                global_wrapper = $('#nt_wrapper');


         //            nav_dropdown.attr('style', '');

         //            var nav_dropdownWidth = nav_dropdown.outerWidth(),
         //                nav_dropdownOffset = nav_dropdown.offset(),
         //                screenWidth = $window.width(),
         //                bodyRight = global_wrapper.outerWidth() + global_wrapper.offset().left,
         //                viewportWidth = ( $('body').hasClass('wrapper-boxed') || $('body').hasClass('wrapper-boxed-small') ) ? bodyRight : screenWidth;

         //                if( ! nav_dropdownWidth || ! nav_dropdownOffset ) return;
         //                if( nav_dropdownWidth >= 0 && li.hasClass( 'menu-center' ) && ! site_header.hasClass('header-7') ) {
         //                    //console.log('center');
         //                    var toLeft = (nav_dropdownOffset.left + (nav_dropdownWidth/2)) - screenWidth/2;
         //                    nav_dropdown.css({
         //                        left: - toLeft
         //                    });

         //                } else if( _rtl && nav_dropdownOffset.left <= 0 && li.hasClass( 'menu_has_offsets' ) && ! site_header.hasClass('header-7') ) {
         //                    var toLeft = - nav_dropdownOffset.left;

         //                    nav_dropdown.css({
         //                        right: - toLeft
         //                    });

         //                } else if( nav_dropdownOffset.left + nav_dropdownWidth >= viewportWidth && li.hasClass( 'menu_has_offsets' ) && ! site_header.hasClass('header-7') ) {
         //                    var toRight = nav_dropdownOffset.left + nav_dropdownWidth - viewportWidth;
         //                    nav_dropdown.css({
         //                        left: - toRight
         //                    });

         //                }
         //                if( site_header.hasClass('header_vertical') ) {

         //                    var bottom = nav_dropdown.offset().top + nav_dropdown.outerHeight(),
         //                        viewportBottom = $window.scrollTop() + $window.outerHeight();

         //                    if( bottom > viewportBottom ) {
         //                        nav_dropdown.css({
         //                            top: viewportBottom - bottom - 10
         //                        });
         //                    }
         //                }
         //        };

         //        Menuoffsets.each(function() {
         //            calcOffset( $(this) );
         //        });
         // },
         
         class_sequentially: function (seat,cl) {
            var _seat = seat || $('.container_cat .pr_animated:not(.done)');
            cl = cl || 'done';
            
            _seat.each(function(index, element) {  
               tuttimer.push(setTimeout(function(){ $(element).addClass(cl); }, 140 * index));
            });
         },
         
         defineProperty: function (obj, key, value) { 
            if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; 
         },

         //product review
         review: function () {
            if (!nt_settings.review || app_review == "2" ) return
            if ( app_review == "1"  && (typeof SPR !== 'undefined' ) ) {
               return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
            } else {
              body.trigger("reviewOther");
            }
         },

         // mobileMenu: function () {
         //    body.on('click','.nav-expand-link',function(e) {
         //       e.preventDefault();
         //       var el = $( this ).closest( 'li' );
         //          el.addClass( 'active' );
         //    });
         //    body.on('click','.nav-back-link',function(e) {
         //       e.preventDefault();
         //       var el = $( this ).closest('li.active');
         //       el.removeClass( 'active' );
         //    });
         // },

         // SimpleBar: function () {
         //    body.find(".nt_simplebar").each(function() {
         //       var $this = $(this)[0];
         //       new SimpleBar($this, { autoHide: false });
         //       //new SimpleBar($('.nt_simplebar'), { autoHide: false });
         //    });
         //    // console.log($('.nt_simplebar'))
         //    // console.log($('.nt_simplebar')[0])
         //    // new SimpleBar($('.nt_simplebar')[0]);
         //   // new SimpleBar($(".nt_simplebar"), { autoHide: false });
         //    //$('.nt_simplebar').each($('.nt_simplebar'), new SimpleBar);
         // },

         /// Scroll to in-page links
         ScrollId: function () {
            body.on('click', geckoTheme.scrollSelector, function(e){
               var $target = $($(this).attr('href'));
               if($target.length == 1) {
                  $('html, body').animate({
                     scrollTop: $target.offset().top - 40
                  }, 500 );
                  e.preventDefault();
               }
            });
         },

         // lazyincluded: function () {
         //    body.bind( "lazyincluded",  function(e){
         //       // console.log(e.target.classList)
         //       var arr = e.target.className.split(" ");
         //       // console.log(arr[0])
         //       switch(arr[0]) {
         //          case "nt_js_menu":
         //           geckoShopify.initMegaMenu();
         //           break;
         //          case "pr_img_js":
         //           if ($(".pr_img_js .pr_slide:not(.flickity-enabled)").length > 0) {
         //           var a = $(e.target), el = a.find('.pr_slide'),option = el.attr("data-flickity");
         //           if (typeof option !== 'undefined') {el.flickity(JSON.parse(option))}
         //           }
         //           break;
         //          case "swatch__list_js":
         //             if ( $('.nt_filter_color .active').length > 0 ) {
         //                var str = $('.nt_filter_color .active').attr('data-handle');
         //                $('.nt_swatch_on_bg.js__'+str).trigger("click")
         //             } 
         //           break;
         //          case "js_sidebar":
         //             var current = body.find('.widget_product_categories  .product-categories> li.current-cat');
         //             if (current.length > 0) {
         //                current.find('> .btn_cats_toggle').click();
         //             }
         //             body.trigger('refresh_currency');
         //             // íntagram
         //           break;
         //          // case "nt_pr_js":
         //          // console.log(arr[0])

         //          //  break;
         //          // case "#shopify-section-nt_filter":
         //          // console.log("#shopify-section-nt_filter")
         //          //    $('.js_filter.btn_filter, a[data-class="popup_filter"]').addClass('nt_visible');
         //          //    if ($('.nt_filter_color .active').length > 0) {
         //          //       var str = $('.nt_filter_color .active').attr('data-handle');
         //          //       //console.log(str)
         //          //       $('.nt_swatch_on_bg.js__'+str).trigger("click");
         //          //    } 
         //          //break;
         //       }
         //       // e.target has new content
         //    });
         // },

         formatMoney: function(cents, format) {
            if (typeof cents == 'string') { cents = cents.replace('.', ''); }
            var value = '',
                placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
                formatString = (format || t_moneyFormat || '${{amount}}');

            var defaultOption = function(opt, def) {
               return (typeof opt == 'undefined' ? def : opt);
            }

            var formatWithDelimiters = function(number, precision, thousands, decimal) {
               precision = defaultOption(precision, 2);
               thousands = defaultOption(thousands, ',');
               decimal = defaultOption(decimal, '.');

               if (isNaN(number) || number == null) {
                  return 0;
               };

               number = (number / 100.0).toFixed(precision);

               var parts = number.split('.');
               var dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
               var cents = parts[1] ? (decimal + parts[1]) : '';

               return dollars + cents;
            }

            switch (formatString.match(placeholderRegex)[1]) {
               case 'amount':
                  value = formatWithDelimiters(cents, 2);
                  break;
               case 'amount_no_decimals':
                  value = formatWithDelimiters(cents, 0);
                  break;
               case 'amount_with_comma_separator':
                  value = formatWithDelimiters(cents, 2, '.', ',');
                  break;
               case 'amount_no_decimals_with_comma_separator':
                  value = formatWithDelimiters(cents, 0, '.', ',');
                  break;
            }

            return formatString.replace(placeholderRegex, value);
         },

         StorageCurrency: function() {
            return (sp_nt_storage) ? localStorage.getItem('T4Currency') : null;
         },


         fullHeightRow: function () {
            var $parent = $("#nt_content >.shopify-section:first"),$element = $parent.find(".se_height_full");
            if ($element.length < 1) return;
               var $window, windowHeight, offsetTop, fullHeight;
               $window = $(window); 
               windowHeight = $window.height(); 
               offsetTop = $element.offset().top; 
               //offsetTop < windowHeight && (fullHeight = 100 - offsetTop / (windowHeight / 100), $element.css("min-height", fullHeight + "vh"))
               if (offsetTop < windowHeight) {
                 fullHeight = 100 - offsetTop / (windowHeight / 100);
                 $element.css("min-height", fullHeight + "vh");
                 $parent.find(".js_full_ht4:not(.nt_parallax_true)").css("min-height", fullHeight + "vh");
                 if ($parent.find(".flickity-enabled").hasClass('flickity-enabled')) { $parent.find(".flickity-enabled ").flickity('resize') }
               }
            //$(document).trigger("jas-full-height-row", $element)
         },
          
         /*
         * Debounce function
         * based on unminified version from http://davidwalsh.name/javascript-debounce-function
         */
          debounce: function(n,t,u){
            var e;return function(){var a=this,r=arguments,i=function(){e=null,u||n.apply(a,r)},o=u&&!e;clearTimeout(e),e=setTimeout(i,t),o&&n.apply(a,r)}
          },

        /**
         *-------------------------------------------------------------------------------------------------------------------------------------------
         * Mobile responsive table
         *-------------------------------------------------------------------------------------------------------------------------------------------
         */

          The4WrappTable: function () {
             $(".t4_table_wrap_js").wrap("<div class='table-responsive'></div>");
          },

         parallax: function() {
            var $parallaxEl = $('.nt_parallax_true');

            if ( $parallaxEl.length == 0 ) return;
            refresh_parallax();
            $('.nt_parallax_true:not(.lazyloaded)').one('lazyloaded', function(e) {
              setTimeout(function(){refresh_parallax();}, 200);   
            });
            // $('.nt_parallax_true:not(.lazyloaded)').one('lazyloaded', function(e) {
            //   setTimeout(function(){  
            //     refresh_parallax();  
            //   }, 100);
            // });


            function refresh_parallax(el) {
              var elm = el || $('.nt_parallax_true.lazyloaded:not(.js_ralax_doned)');
              elm.addClass('js_ralax_doned').jarallax({
                speed: elm.attr('data-speed') || 0.8
              });

              //                  imgSize:"cover",
              //                  imgPosition :"50% 50%",
              //                  disableParallax: function () {
              //                     return /iPad|iPhone|iPod|Android/.test(navigator.userAgent);
              //                 },
            }
          },

         // parallax: function() {
         //    var $parallaxEl = $('.nt_parallax_true');

         //    //if ( $.fn.parallax == "undefined" || $parallaxEl.length < 1 ) return;
         //    // $parallaxEl.each(function (index) { geckoShopify.refresh_parallax($(this)) });

         //    if ( window.skrollr == "undefined" || $parallaxEl.length == 0 ) return;

         //     $(".nt_parallax_true").each(function() {
         //       var skrollrSize = 100 * ($(this).data("prlx") || 0.5);
         //       var skrollrStart = -(skrollrSize - 100);
         //       //$(this).height(skrollrSize + "%").attr("data-bottom-top", "top: " + skrollrStart + "%;").attr("data-top-bottom", "top: 0%;");
         //       $(this).attr("data-bottom-top", "top: " + skrollrStart + "%;").attr("data-top-bottom", "top: 0%;");
         //     });
         //     // Modernizr.hovermq
         //     skrollr.init({ forceHeight: false, smoothScrolling: false, mobileCheck: function() { return false } });
         // },
         
         // refresh_parallax: function (el) {
         //    // var speed = el.data('speed') || 0.3;
         //    // el.parallax("50%", speed, false);

         //    if ( window.skrollr == "undefined" ) return;
         //    var skrollrSize = 100 * (el.data("prlx") || 1.5);
         //    var skrollrStart = -(skrollrSize - 100);
         //    el.height(skrollrSize + "%").attr("data-bottom-top", "top: " + skrollrStart + "%;").attr("data-top-bottom", "top: 0%;");
         //    // Modernizr.hovermq
         //    skrollr.init({ forceHeight: false, smoothScrolling: false, mobileCheck: function() { return false } });
         // },
         
         refresh_flickity: function (el) {
             var option = el.attr("data-flickity") || el.attr("data-flickityjs") || '{}';
             el.flickity(JSON.parse(option));
         },
         
         refresh_packery: function (el) {
             var option = el.attr("data-packery") || '{}';
             el.packery(JSON.parse(option));
         },
         
         refresh_isotope: function (el) {
            // data-isotope='{ layoutMode: 'masonry',"itemSelector": ".grid-item",percentPosition: true,isOriginLeft: true,"masonry": { "gutter": 0,"columnWidth": ".grid-item" } }'
             var option = el.attr("data-isotope") || '{}';
             el.isotope(JSON.parse(option));
         },
         
         // fix height flickity select.flickity change.flickity
         FixHeight: function () {
            $(".type_carousel .js_carousel").on("change.flickity", function(event, index) {
              var $carousel = $(event.currentTarget);
              // console.log($carousel);
              if ( $carousel.find(".nt_pr:last-child").hasClass("is-selected") ) {
                var width = $(window).width(), colum = 4, arr = [];

                if ( width >= 1025 ) {
                  colum = ( $carousel.data('cl') == 15 ) ? 5 : 12 / $carousel.data('cl');
                } else if ( width >= 768 ) {
                  colum = 12 / $carousel.data('tb');
                } else {
                  colum = 12 / $carousel.data('mb');
                }
                var lth_selected = $carousel.find(".nt_pr.is-selected").length,
                  index = colum - lth_selected;
                  // console.log(colum);
                  // console.log(lth_selected);
                  // console.log(index);
                if ( index == 0 ) return;

                //console.log(colum);
                //console.log("Flickity last");
                $carousel.find(".nt_pr").each(function (index) { 
                  arr.push( $(this).outerHeight(true) );
                });
                //console.log(arr);

                var array1 = arr.slice(0, index);
                $carousel.find(".nt_pr.is-selected").each(function (index) { 
                  array1.push( $(this).outerHeight(true) );
                });
                var setHeight = Math.max.apply(this,array1);
                // var setHeight = Math.max(...array1);
                $carousel.find('.flickity-viewport').css({ 'height': setHeight + "px" });
              }
            });
         },

         BGVideoSection: function () {

            if ( $('.js_video').length == 0 ) return;
            
            var yt_src = '//www.youtube.com/iframe_api';
            $script(yt_src, 'loaded_v_js');

            body.on('youTubeReady', function() {
               $('.js_video').each(function (index) {
                  //console.log('index: '+index);
                  geckoShopify.refresh_Youtube($(this));
               });
            });
         },
    
          // video html5
          InitHTMLVideo: function () {
            //https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
            if ($('.vid_nt_js').length == 0 || !Modernizr.video) return;
           
            $('.vid_nt_js').each(function() {
               var _this = $(this),
                   _img = _this.parent().find('.img_vid_js');
              _this.addClass('lazyload');
                _this.on('lazyloaded', function() {
                  _this[0].play();
                  _this.addClass('vid_ready'); 
                  _img.addClass('lazyload');
                });

                _this.on('playing', function() {
                  _img.remove();
                });
              // _this.on('loadeddata', function() {
                
              //   if(_this[0].readyState >= 2) {
              //     console.log(' loaded vid ');
              //     _this.addClass('vid_ready')
              //     if (_this.hasClass('vid_bg')) {
              //       _this[0].play();
              //     }
              //   }

              // });
              // _this.one('play', function() {
              //   // console.log(' play vid ');
              //    _this.addClass('vid_ready')
              // });
              
            });
          },

         hTransparent: function (bl) {
            if ( body.hasClass('h_banner_false') ) return;
            
            var h_banner = $('#shopify-section-header_banner'),
                h_ver = h_banner.find('.h__banner').attr('data-ver'),
                txt_ver = 'h_banner_' + h_ver;

            if ( Cookies.get(txt_ver) == 'closed' && !designMode) return;

            function calcMT() {
               // var mt = 0; body.removeClass('h_calc_ready');
               // mt += h_banner.outerHeight();
               // body.addClass('h_calc_ready');
               // if (mt) { $('#nt_wrapper').css({marginTop: mt});body.addClass('h_calc_ready'); }
               body.removeClass('h_calc_ready');
               h_banner.css("height", "");

               var mt = h_banner.outerHeight();
               body.addClass('h_calc_ready');
               h_banner.css({height: 0});
               // $('#nt_wrapper').css({marginTop: mt});
               // h_banner.trigger("h_banner_ok");
               //h_banner.css({height: mt}); 
              
               setTimeout(function(){ h_banner.css({height: mt }); }, 8);
               setTimeout(function(){ h_banner.css({height: 'auto'}); }, 800);
            }
            calcMT(); 
            // if (bl) {calcMT();}
            // $(window).resize(function(){ 
            //    if ( Cookies.get(txt_ver) == 'closed' ) return; 
            //    calcMT(); 
            // }); 

            h_banner.on('click', '.h_banner_close', function (e) {
               //console.log('click btn')
               e.preventDefault();
               //$('#nt_wrapper').css({marginTop: 0});
               var mt = h_banner.outerHeight();
               h_banner.css({height: mt });
               setTimeout(function(){ h_banner.css({height: 0}); }, 8);
               var date = parseInt(h_banner.find('.h__banner').attr('data-date'));
               if (date && !designMode){ Cookies.set(txt_ver, 'closed', { expires: date, path: '/' }) }
            });

         },

         // hTransparent7: function (bl) {
         //    if ( body.hasClass('h_banner_false') || !body.hasClass('des_header_7') ) return;
            
         //    var h_banner = $('#shopify-section-header_banner'),
         //        h_ver = h_banner.find('.h__banner').attr('data-ver');

         //    if ( Cookies.get('h_banner_' + h_ver) == 'closed' && !designMode) return;
         //    h_banner.slideDown(250);

         //    h_banner.on('click', '.h_banner_close', function (e) {
         //       e.preventDefault();
         //        h_banner.slideUp(250);
         //       var date = parseInt(h_banner.find('.h__banner').attr('data-date'));
         //       if (date && !designMode){ Cookies.set('h_banner_' + h_ver, 'closed', { expires: date, path: '/' }) }
         //    });

         // },


         getDateCountdown : function(date) {
          // console.log(date);
          if (typeof date == 'undefined') return;
           // moment.tz.names()
           var rt_date = date.replace("24:00:00", "23:59:59");

           if (timezone != 'not4' ) {
              try {
                //console.log(date.replace("/", "-").replace("/", "-"));
                //console.log(timezone);
                // rt_date = moment(date.replace("/", "-").replace("/", "-")).tz(timezone).format('YYYY/MM/DD HH:mm:ss');
                rt_date = moment.tz(date.replace(/\//g,"-"), timezone).toDate();
              }
              catch(err) {
                console.log('Timezone error: '+timezone);
              }
           } else {
             rt_date = new Date(rt_date);
           }
           return rt_date
         },

         // Init Countdown
         InitCountdown : function() {

            var pr_coun_dt = $('.pr_coun_dt:not(.done_cd)');
            if (pr_coun_dt.length == 0) return;
            var prItemCountdown = nt_settings.prItemCountdown;
            
            pr_coun_dt.each(function() {
               var _this = $(this),
                   pr_deal_dt = _this.closest('.pr_deal_dt'),
                   nt_pr = _this.closest('.nt_pr');
               _this.countdown(geckoShopify.getDateCountdown(_this.data('date')), {elapse: true})
               .on('update.countdown', function(event) {
                 if (event.elapsed) {
                   pr_deal_dt.html('').addClass('expired_cdt4');
                   nt_pr.addClass('expired_nt_pr');
                 } else {
                   _this.html(event.strftime(prItemCountdown));
                   //nt_pr.removeClass('expired_nt_pr');
                 }
               }).addClass('done_cd').closest('.pr_deal_dt').addClass('donetmcd');
            });
         },

         InitSeCountdown : function() {

            var pr_coun_dt = $('.sepr_coun_dt:not(.done_cd)');
            if (pr_coun_dt.length == 0) return;
            var countdown_days = nt_settings.countdown_days,
                countdown_hours = nt_settings.countdown_hours,
                countdown_mins = nt_settings.countdown_mins,
                countdown_sec = nt_settings.countdown_sec;

           pr_coun_dt.each(function () {
                var _this = $(this);
               _this.countdown(geckoShopify.getDateCountdown(_this.data('date')), function (event) {
                  _this.html(event.strftime(''
                     + '<span class="countdown-days">%-D <span>' + countdown_days + '</span></span> '
                     + '<span class="countdown-hours">%H <span>' + countdown_hours + '</span></span> '
                     + '<span class="countdown-min">%M <span>' + countdown_mins + '</span></span> '
                     + '<span class="countdown-sec">%S <span>' + countdown_sec + '</span></span>'));
               }).addClass('done_cd').closest('.sepr_deal_dt').addClass('donetmcd');
            });
         },

         bannerCountdown: function (){
             
            // https://stackoverflow.com/questions/42554744/javascript-remove-all-in-a-string
            if ($('[data-hbanner_cd]').length == 0) return;

            var str_banner = nt_settings.bannerCountdown;

            function hbanner_fns(hbanner_cd) {

              var dt_loop = hbanner_cd.data('loop'),
                  day_final = hbanner_cd.data('date'),
                  d_now = moment(),
                  d_now_num = parseInt(d_now.format("YYYYMMDD")),
                  day_final_num = parseInt(day_final.replace(/\//g,""));
                
              if (day_final_num > d_now) {
                dt_loop = false;
              }
              if (dt_loop || dt_loop == 'true') {

                // var d_now = moment(),
                //     dayl = hbanner_cd.data('dayl') || 7,
                //     DayofWeek = moment().format("e"),
                //     DayuntilWeek = parseInt(dayl) - parseInt(DayofWeek);

                // // YYYY/MM/DD hh:mm:ss
                // d_now.add(DayuntilWeek, 'days');
                // day_final = d_now.format("YYYY/MM/DD")+' 23:59:59';
                // //console.log('day_final ', day_final,DayuntilWeek)

                // .replace(/ /g,'') .replace(/\//g,"-")

                var dayl = parseInt(hbanner_cd.data('dayl')), // so ngap lap
                    date1 = d_now.diff(day_final.replace(/\//g,"-"), 'days'), // lay tong so ngay giua 2 moc thoi gian
                    num1 = date1 % dayl,
                    num2 = dayl - num1;

                d_now.add(num2, 'days');
                // d_now.subtract(num2, 'days');
                //day_final = d_now.format("YYYY/MM/DD")+' 23:59:59';
                day_final = d_now.format("YYYY/MM/DD");
                //console.log('day_final ', day_final)
              }

              hbanner_cd.countdown(geckoShopify.getDateCountdown(day_final), function(event) {
                $(this).html(event.strftime(str_banner));
              });
            };

            $('[data-hbanner_cd]').each(function() {
              hbanner_fns($(this));
            });
         },
         
   
         // Filter remove same localStorage 
         // Eg: filteredLS('nt_cartcd')
         // Results: nt_cartcdhrs100, nt_cartcdhrs50, nt_cartcdhrs28, nt_cartcdhrs19
         // https://stackoverflow.com/questions/48796550/json-stringifylocalstorage-filtering-by-key
         filteredRemoveLS: function (term,keyCurent){ 
              var filteredObj = {};
              Object.keys(localStorage)

                  .filter(function (key) {
                      return key.indexOf(term) >= 0;
                  })

                  .map(function (key) {
                      if (key != keyCurent) {
                        localStorage.removeItem(key);
                      }
                      //filteredObj[key] = localStorage.getItem(key);
                  });
              
              // return JSON.stringify(filteredObj);
              // return filteredObj;
          },
   
         cartCountdown: function (){ 
            var cart_cd = $('[data-cart-countdown]'),
                that = this;
                //console.log(that)
            if (cart_cd.length == 0) return;
            
            //format = '%H:%M:%S',
            var mn = parseInt(cart_cd.attr('data-mn')),
                unit = cart_cd.data('unit'),
                nt_cartcd_mn = 'nt_cartcd'+unit+mn,
                val = (unit == 'min') ? mn * 60 * 1000 : mn * 60 * 60 * 1000,
                format = '%M min %S sec',
                selectedDate,
                totalHours = 0,
                after_atc_1 = ($('[data-after-cartcd-1]').length>0),
                params = {
                   type: 'POST',
                   url: '/cart/clear.js',
                   data:  '',
                   dataType: 'json',
                   success: function(cart) {},
                   error: function(XMLHttpRequest, textStatus) {
                     console.error(textStatus);
                   }
                };
             that.filteredRemoveLS('nt_cartcd',nt_cartcd_mn);

            if (sp_nt_storage) { 
               if (localStorage.getItem(nt_cartcd_mn) !== null) {
                  selectedDate = parseInt(localStorage.getItem(nt_cartcd_mn));
               } else {
                  selectedDate = new Date().valueOf() + val;
                  localStorage.setItem(nt_cartcd_mn, selectedDate);
               }
            }
            $('.js_cart_cd').show();
            cart_cd.countdown(selectedDate.toString()).on('update.countdown', function(event) {
                totalHours = event.offset.totalDays * 24 + event.offset.hours;
                if (totalHours > 24){
                  format = totalHours+' hr %M min %S sec';
                } else if (totalHours >= 1){
                  format ='%H hr %M min %S sec';
                }
                //console.log(totalHours)
               $(this).html(event.strftime(format));

            }).on('finish.countdown', function(event) {

               if (after_atc_1){

                  selectedDate = new Date().valueOf() + val;
                  localStorage.setItem(nt_cartcd_mn, selectedDate);
                  cart_cd.countdown(selectedDate.toString());

               } else {
                  // remove all item cart
                  $(this).parent().remove();
                  $.ajax(params);
                  if (sp_nt_storage) { localStorage.removeItem(nt_cartcd_mn) }
               }
               //$(this).parent().addClass('disabled').html('This offer has expired!');
               
            });
         },
         
         refresh_Youtube: function (_this) {
        
            // https://developers.google.com/youtube/iframe_api_reference
            if (!window.YT) return;
          
            var attemptedToPlay = false,
                loading = 'video_loading',
                loaded = 'video_loaded',
                interactable = 'video_interactable';
            var YTPlayer = new YT.Player(_this.find('.videoplayer')[0], {
               videoId: _this.data('id'),
                width: 1280,
                height: 720,
               playerVars: {
                  // start: 10,
                  // end: 15,
                  iv_load_policy: 3,
                  enablejsapi: 1,
                  disablekb: 1,
                  autoplay: 0,
                  controls: 0,
                  rel: 0,
                  loop: 0,
                  playsinline: 1,
                  modestbranding: 1,
                  autohide:1,
                  branding: 0,
                  cc_load_policy: 0,
                  fs: 0,
                  quality: 'hd1080',  //hd1080, hd720
                  wmode: "transparent"
                },
                events: {
                  onReady: onPlayerReady,
                  onStateChange: onPlayerStateChange
                }
            });

            function onPlayerReady(evt) {
              // evt.target.setPlaybackQuality('hd1080');
              // evt.target.setPlaybackQuality('hd1080').playVideo().mute();
              //if ( _this.hasClass('unmute_false') ) {evt.target.mute();}
              YTPlayer.setPlaybackQuality('hd1080').playVideo().mute();
            }
            
            function onPlayerStateChange(evt) {
                // if (evt.data == YT.PlayerState.BUFFERING) {
                //     evt.target.setPlaybackQuality('hd720');
                // }
                // if (evt.data == 1) {
                //   _this.addClass('video_playing')
                // }
                switch (evt.data) {
                  case -1: // unstarted
                    // Handle low power state on iOS by checking if
                    // video is reset to unplayed after attempting to buffer
                    if (attemptedToPlay) {
                     //alert('adu');
                     $('.img_vid_js:not(.lazyloaded)').addClass('lazyload');
                      setVideoLoaded(_this);
                      setVideoInteracted(_this);
                    }
                    break;
                  case 0: // ended
                    // evt.target.playVideo();
                    // console.log(YTPlayer)

                    // YTPlayer.loadVideoById({
                    //   videoId: _this.data('id'),
                    //   startSeconds: 10,
                    //   endSeconds: 15,
                    //   suggestedQuality: 'hd1080'
                    // });

                    YTPlayer.playVideo();
                    break;
                  case 1: // playing
                    setVideoLoaded(_this);
                    break;
                  case 3: // buffering
                    attemptedToPlay = true;
                    YTPlayer.setPlaybackQuality('hd1080');
                    break;
                }
                //console.log(evt.data)
            }

            var setVideoLoading = function(el) {
              el.addClass(loading);
            };

            var setVideoLoaded = function(el) {
              el.removeClass(loading).removeClass(interactable).addClass(loaded);
            };

            var setVideoInteracted = function(el) {
              el.addClass(interactable);
            };
         },
         
         /*
          * Debounce function
          * based on unminified version from http://davidwalsh.name/javascript-debounce-function
          */
         Debounce: function (func, wait, immediate) {
            var timeout;
            return function() {
               var context = this, args = arguments;
               var later = function() {
                  timeout = null;
                  if (!immediate) func.apply(context, args);
               };
               var callNow = immediate && !timeout;
               clearTimeout(timeout);
               timeout = setTimeout(later, wait);
               if (callNow) func.apply(context, args);
            };
         },
         
         loadingBar: function (_this) {
            if ($ld.length == 0) return;

            $ld.on("ld_bar_star", function() { $ld.addClass('on_star') });
            $ld.on("ld_bar_60", function() { $ld.addClass('on_60') });
            $ld.on("ld_bar_80", function() { $ld.addClass('on_80') });
            $ld.on("ld_bar_90", function() { $ld.addClass('on_90') });
            $ld.on("ld_bar_94", function() { $ld.addClass('on_94') });
            $ld.on("ld_bar_end", function() {
              $ld.addClass('on_end');
              setTimeout(function(){ $ld.attr('class', '').addClass('op__0 pe_none'); }, 300);
            });
            //$('#ld_cl_bar').trigger( "ld_bar_star" );
            //$ld.trigger( "ld_bar_star" );
            //$ld.trigger( "ld_bar_end" );
         },
         
         CartAttrHidden: function () {
            var js_ipatt = $('[data-cart-attr-rm]'),count=0;
            if (js_ipatt.length == 0 || nt_settings.CartAttrHidden) return;

            var loopfnsremove = setInterval(function(){ 
              js_ipatt.val('');
              //console.log('loopfnsremove')
              if (count == 15) { clearInterval(loopfnsremove) }
              count++
            }, 500);
           
           body.on('click', 'button[type=submit][name="checkout"]', function(e) {
             js_ipatt.val('');
           });
         },
         
         loadCSS: function (id,url) {
            $( id ).replaceWith( $('<link rel="stylesheet" type="text/css" />').attr('href', url) );
            //geckoShopify.loadCSS('#stylecssjst4',JSNTT4.data('stylecss'));
         },
         
         // cartPosDropdown: function() {

         //    if (!body.hasClass('cart_pos_dropdown') || !Modernizr.hovermq || body.hasClass('template-cart')) return;
               
         //       var $cart = $('#nt_cart_canvas'),
         //           $window = $(window),
         //           Timeout;
         //       $('.icon_cart').on("click", function(e) {
         //         e.preventDefault();

         //         clearTimeout(Timeout);
         //         var $this = $(e.currentTarget);
         //          if ( $this.hasClass('current_clicked') ) {
         //            $this.removeClass("current_clicked");
         //            $cart.removeClass("current_hover");
         //            $(e.currentTarget).removeClass('mask_opened');
         //            Timeout = setTimeout(function(){ $cart.removeAttr("style");$(e.currentTarget).removeClass('cart_mask'); }, 250);
                    
         //          } else {
         //             var windowHeight = $window.height(), 
         //                 offsetTop = $('.dropdown_cart').offset().top; 
         //             if (offsetTop < windowHeight) {
         //               var fullHeight = 100 - (offsetTop+15) / (windowHeight / 100);
         //               $cart.css("max-height", fullHeight + "vh");
         //             }
         //            $this.addClass("current_clicked");
         //            $cart.css("top", offsetTop);
         //            if ( $('.live_stuck').length > 0 ) {
         //             $cart.css("top", $('.ntheader_wrapper').outerHeight());
         //            }
         //            $('.mask-overlay').addClass('mask_opened cart_mask');
         //            Timeout = setTimeout(function(){
         //               $cart.addClass("current_hover");
         //            }, 250);
         //          }
         //       });
         //       $('.mask-overlay').on("click", function(e) {
         //          e.preventDefault();
         //          clearTimeout(Timeout);
         //          $('.icon_cart.current_clicked').removeClass("current_clicked");
         //          $cart.removeClass("current_hover");
         //          $(e.currentTarget).removeClass('mask_opened');
         //          Timeout = setTimeout(function(){ $cart.removeAttr("style");$(e.currentTarget).removeClass('cart_mask'); }, 250);
         //       });
         // },
         // end function
      }
   }());
})( jQuery_T4NT );

jQuery_T4NT(document).ready(function($) {
  
  var body = $('body'),
      pathname_hash = location.pathname + location.hash;
  if ( pathname_hash == '/challenge#contact_form') {
    setTimeout(function(){
          $('html, body').animate({
              scrollTop: 0
          }, 800);
      
    }, 50);
  }
  if (ThemeIdLoT4 != 'true' && ThemeIdT4 != 'true') {
   $(ThemePuT4).removeClass('hide hidden');
  }
  //WebFont.load({ custom: { families: JSNTT4.data('font').split(' , ') } });
  geckoShopify.init();
  
  if ($(window).width() > 1024) {
   $('.lazy_menu.lazyload').addClass('lazypreload');
  }

  if(t_name == 'cart') { geckoShopify.cartCountdown(); }
  // replace data attr
  var vmy = JSNTT4.data('my');
  //if ( $('.js_nt_ist').length <= 0 && !designMode ) { JSNTT4.attr('data-ins',vmy); }
  if ( parseInt(nt_settings.platform_email) < 3 && !designMode  ) { JSNTT4.attr('data-mail',vmy); }
  if ( $('.nt__addthis').length <= 0 && !designMode ) { JSNTT4.attr('data-add',vmy); }

  // window.onYouTubeIframeAPIReady = function() {
  //   body.trigger('youTubeReady');
  //   //body.trigger('youTubePrReady');
  // }

  // load js
  // $script(JSNTT4.data('cat'), 'cat_loaded');
  // $script.ready('cat_loaded', function() { $script(JSNTT4.data('sw'), 'sw_loaded'); });
  $script([ JSNTT4.data('cat'),JSNTT4.data('sw') ], 'sw_loaded');

  $script.ready('sw_loaded', function() {
    //$script([ JSNTT4.data('user'),JSNTT4.data('cusp') ], 'ready4');
    $script([ JSNTT4.data('user'),JSNTT4.data('cusp'),JSNTT4.data('spcmn') ], 'ready4');
    if ( app_review == "3" ) {
      $script(JSNTT4.data('otherryv'));
    }
  });

  $script.ready('ready4', function() { 
    $script([ JSNTT4.data('cur'),JSNTT4.data('ins'),JSNTT4.data('mail'),JSNTT4.data('cust'), JSNTT4.data('mdl'), JSNTT4.data('add') ], 'ready5');
  });

  $script.ready('ready5', function() {
    if (designMode) { $script(JSNTT4.data('desadm')); }
  });
  // end load js
  if (jscd.browser == 'Internet' && jscd.os =='Windows' && !jscd.mobile ) {
   $('.clno-hovermq').removeClass('clno-hovermq').addClass('clhovermq');
   Modernizr.hovermq = true;
  }

});

// jQuery_T4NT( window ).on( "load", function($) {
// });

/**
 * ----------------------------------------------------------------------------
 * FLICKITY
 *
 * Starting from iOS 11, Safari on iOS is experiencing a bug that prevents
 * event.preventDefault to be called on dynamically added listeners, which is
 * what Flickity is using.
 *
 * The bug is coming from iOS but it impacts indirectly Flickity. A temporary
 * fix has been suggested here: https://github.com/metafizzy/flickity/issues/740
 * and that we are using here as a temporary workaround, that should be removed
 * once the bug is fixed on iOS
 * ----------------------------------------------------------------------------
 */

(function () {
   //console.log('no iOS')
    //if (jscd.os != "iOS") return;
   //console.log('iOS')
  if (!Modernizr.touchevents) return;
  var touchingCarousel = false,
      touchStartCoords = void 0;

  document.body.addEventListener('touchstart', function (e) {
    if (e.target.closest('.flickity-enabled.is-draggable:not(.p-nav)')) {
      touchingCarousel = true;
    } else {
      touchingCarousel = false;
      return;
    }

    touchStartCoords = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY
    };
  });

  document.body.addEventListener('touchmove', function (e) {
    if (!(touchingCarousel && e.cancelable)) {
      return;
    }

    var moveVector = {
      x: e.touches[0].pageX - touchStartCoords.x,
      y: e.touches[0].pageY - touchStartCoords.y
    };

    if (Math.abs(moveVector.x) > nt_settings.dragThreshold) e.preventDefault();
  }, { passive: false });
})();
//   var tapArea, startX ;
//   tapArea = document.querySelectorAll('.flickity-enabled.is-draggable:not(.p-nav)');
//   startX = 0;
//   for (var item of tapArea) {
//       item.ontouchstart = function(e) {
//           startX = e.touches[0].clientX;
//       };
//       item.ontouchmove = function(e) {
//           if (Math.abs(e.touches[0].clientX - startX) > Flickity.defaults.dragThreshold && e.cancelable ) {
//               e.preventDefault();
//           }
//       };
//   } 