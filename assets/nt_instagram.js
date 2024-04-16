// via Legacy API: 7016307166.1677ed0.c4674f47a3d649e48b97be06c5a437e6
// https://developers.facebook.com/docs/instagram-basic-display-api/reference/media
(function( $ ) {
   "use strict";

    // geckoShopify.refresh_ins = function (_this) {
    //   var datalm = null, data = null, id = '', 
    //       getBy = _this.data('getby'),
    //       dtid = _this.data('id'),
    //       limit = _this.data('limit'),
    //       //username = _this.data('name'),
    //       source = _this.data('source'),
    //       deafult_txt = 'spnt_t4',
    //       acc1 = _this.data('acc1') || deafult_txt,
    //       acc2 = _this.data('acc2') || deafult_txt,
    //       tag = _this.data('tag') || deafult_txt,
    //       username = 'the4_studio',
    //       host = "https://www.instagram.com/",
    //       is_tag = true,
    //       user_tag = tag;
         
    //   if ((source == '1' && acc1 == deafult_txt ) || (source == '2' && acc2 == deafult_txt) || (source == '3' && tag == deafult_txt)) return;


    //   if (source == '1') {
    //     user_tag = acc1;
    //   } else if (source == '2') {
    //     user_tag = acc2;
    //   }
    //   //console.log(user_tag);
    //   if (sp_nt_storage) { datalm = sessionStorage.getItem('nt_ins'+user_tag+dtid);data = sessionStorage.getItem('nt_ins'+user_tag) }

    //   if ( datalm != null && data != '' ) {

    //        _this.html(datalm).parent().addClass('ins_loaded');
    //        if ( !_this.hasClass('js_carousel')) return;
    //        geckoShopify.refresh_flickity(_this);

    //        return false;
    //   }

    //   // if(display_gallery){}
    //   // if(display_igtv && typeof data.edge_felix_video_timeline !== "undefined"){ var igtv = data.edge_felix_video_timeline.edges; }

    //   if ( data != null && data != '' ) {
    //         data = JSON.parse(data);
    //         ins_js(_this,data,false,user_tag,limit,dtid,source);

    //   } else {
    //       if (source == '1') {
    //         GetinstagramAcess1(_this,user_tag,acc1,limit,dtid,source);
    //       } else if (source == '2') {
    //         GetinstagramAcess2(_this,user_tag,acc2,limit,dtid,source);
    //       } else {
    //         Getinstagram1(_this,user_tag,is_tag,host,tag,username,limit,dtid,source);
    //       }
    //   }
    //   // end if
    // };

    geckoShopify.refresh_ins = function (_this) {
      var datalm = null, data = null, id = '', 
          getBy = _this.data('getby'),
          dtid = _this.data('id'),
          limit = _this.data('limit'),
          deafult_txt = 'spnt_t4',
          acc = _this.data('acc') || deafult_txt;
         
      if (acc == deafult_txt) return;
      //console.log(acc);
      if (sp_nt_storage) { datalm = sessionStorage.getItem('nt_ins'+acc+dtid);data = sessionStorage.getItem('nt_ins'+acc) }

      if ( datalm != null && data != '' ) {

           _this.html(datalm).parent().addClass('ins_loaded');
           if ( !_this.hasClass('js_carousel')) return;
           geckoShopify.refresh_flickity(_this);

           return false;
      }

      // if(display_gallery){}
      // if(display_igtv && typeof data.edge_felix_video_timeline !== "undefined"){ var igtv = data.edge_felix_video_timeline.edges; }

      if ( data != null && data != '' ) {
            data = JSON.parse(data);
            ins_js(_this,data,false,acc,limit,dtid);

      } else {
           if (acc == 'ins_19041994') {
            var ajaxUrl = nt_settings.ins_host+'/instagram/media?shop='+Shopify.shop+'&resource=default';
           } else {
            var ajaxUrl = 'https://graph.instagram.com/me/media?fields=comments_count,like_count,id,media_type,media_url,permalink,thumbnail_url,caption,children&access_token='+acc;
           }
           $.ajax({
             url: ajaxUrl,
             type: 'GET',
             dataType: "json",
             success: function (res) {
               var data = (acc == 'ins_19041994') ? res : res.data;
               ins_js(_this,data,true,acc,limit,dtid);
             },
             error: function (e) {
               console.error("Instagram Feed:error acc1");
              fetch(ajaxUrl).then((response) => {
                  response.json().then((media) => {
                    //console.log(media)
                    var media_txt = media.message || 'no_txt';
                    if (media_txt != 'no_txt') {
                      _this.html('<div class="tc cr tu fwm col-12">'+media_txt+'</div>').parent().addClass('ins_loaded');
                      return false;
                    }
                    // media is a json containing the data about the 25 latest media.
                    var data = (acc == 'ins_19041994') ? media : media.data;
                    ins_js(_this,data,true,acc,limit,dtid);
                  });
              });
             }
           });
      }
      // end if
    };

    function ins_js(_this,data,bl,acc,limit,dtid) {
      //console.log(data);
      //data = JSON.parse(data); 
      //console.log(data);
      var html = '',
          bl = bl || true,
          cl = _this.data('cl'),
          cltb = _this.data('cltb'),
          clmb = _this.data('clmb'), 
          target = _this.data('target');

          $.each(data, function (index, el) {
             if (index >= limit) return 0;
             //console.log(el);
             var img_url = el.thumbnail_url || el.media_url;
             //html += '<div class="cl_nt_'+index+' col_ins col-'+clmb+' col-md-'+cltb+' col-lg-'+cl+' item pr ins_media_type_'+el.media_type+'"><a data-no-instant rel="nofollow" class="db pr oh" href="'+el.permalink+'" target="' + target + '"><div class="lazyload nt_bg_lz pr_lazy_img" data-bg="' + img_url + '" data-sizes="auto"></div><div class="info pa tc flex ts__03 fl_center al_center op__0 t__0 l__0 r__0 b__0 h__100 pe_none like_t4ins'+el.like_count+' cms_t4ins'+el.comments_count+'"><span class="pr cw mr__5 ml__5"><i class="facl facl-heart-o mr__5"></i>'+el.like_count+'</span><span class="pr cw"><i class="facl facl-comments-o mr__5"></i>'+el.comments_count+'</span></div></a></div>';
             html += '<div class="cl_nt_'+index+' col_ins col-'+clmb+' col-md-'+cltb+' col-lg-'+cl+' item pr ins_media_type_'+el.media_type+'"><a data-no-instant rel="nofollow" class="db pr oh" href="'+el.permalink+'" target="' + target + '"><div class="lazyload nt_bg_lz pr_lazy_img" data-bg="' + img_url + '" data-sizes="auto"></div><div class="info pa tc flex ts__03 fl_center al_center op__0 t__0 l__0 r__0 b__0 h__100 pe_none"><span class="pr cw"><i class="las la-video"></i><i class="las la-image"></i></span></div></a></div>';
          });

        //console.log(html);
        _this.html(html).parent().addClass('ins_loaded');
        
        if ( _this.hasClass('js_carousel')) {
          geckoShopify.refresh_flickity(_this);
        }

        if (sp_nt_storage && bl) { 
           sessionStorage.setItem('nt_ins'+acc+dtid, html);
           sessionStorage.setItem('nt_ins'+acc, JSON.stringify(data));
        }
   };


    // function GetinstagramAcess1(_this,user_tag,acc1,limit,dtid,source) {

    //    $.ajax({
    //      url: "https://api.instagram.com/v1/users/self/media/recent/?access_token="+acc1+"&count="+limit,
    //      type: 'GET',
    //      dataType: "jsonp",
    //      success: function (res) {
    //        if(res.meta.code == 400) {
    //          console.error('instagram acc1: '+ res.meta.error_message );
    //        } else {
    //          //console.log(res);
    //          var data = res.data;
    //          ins_js(_this,data,true,user_tag,limit,dtid,source);
    //        }
    //      },
    //      error: function (e) {
    //        console.error("Instagram Feed:error acc1");
    //      }
    //    });

    // };
    
    // function Getinstagram1(_this,user_tag,is_tag,host,tag,username,limit,dtid,source) {

    //   // var escape_map = {
    //   //     '&': '&amp;',
    //   //     '<': '&lt;',
    //   //     '>': '&gt;',
    //   //     '"': '&quot;',
    //   //     "'": '&#39;',
    //   //     '/': '&#x2F;',
    //   //     '`': '&#x60;',
    //   //     '=': '&#x3D;'
    //   // };
    //   // function escape_string(str){
    //   //     return str.replace(/[&<>"'`=\/]/g, function (char) {
    //   //         return escape_map[char];
    //   //     });
    //   // }
    //   // if(typeof imgs[i].node.edge_media_to_caption.edges[0] !== "undefined"){
    //   //     caption = imgs[i].node.edge_media_to_caption.edges[0].node.text;
    //   // }else if(typeof imgs[i].node.accessibility_caption !== "undefined"){
    //   //     caption = imgs[i].node.accessibility_caption;
    //   // }else{
    //   //     caption = (is_tag ? data.name : data.username) + " image " + i;
    //   // }
    //   // html += "<img src='" + image + "' alt='" + escape_string(caption) + "'" + styles.gallery_image +" />";

    //   var url = is_tag ? host + "explore/tags/"+ tag : host + username;

    //   $.get(url, function(data){

    //       //data = data.split("window._sharedData = ")[1].split("<\/script>")[0];
    //       // See error1:  It looks like the profile you are trying to fetch is age restricted. https://github.com/jsanahuja/InstagramFeed/issues/26"
    //       // See error2:  It looks like YOUR network has been temporary banned because of too many requests. https://github.com/jsanahuja/jQuery_T4NT.instagramFeed/issues/25"
    //       try{
    //           data = data.split("window._sharedData = ")[1].split("<\/script>")[0];
    //       }catch(e){
    //           InstagramUser1(_this,user_tag,is_tag,host,tag,username,limit,dtid,source);
    //           console.error("Instagram Feed:See error1");
    //           return;
    //       }
    //       data = JSON.parse(data.substr(0, data.length - 1));
    //       data = data.entry_data.ProfilePage || data.entry_data.TagPage;
    //       if(typeof data === "undefined"){
    //           InstagramUser1(_this,user_tag,is_tag,host,tag,username,limit,dtid,source);
    //           console.error("Instagram Feed:See error2");
    //           return;
    //       }
    //       data = data[0].graphql.user || data[0].graphql.hashtag;
    //       ins_js(_this,data,true,user_tag,limit,dtid,source);

    //   }).fail(function(e){
    //      InstagramUser1(_this,user_tag,is_tag,host,tag,username,limit,dtid,source);
    //     _this.parent().addClass('ins_loaded');
    //     console.error("Instagram Feed: Unable to fetch the given user/tag. Instagram responded with the status code: ", e.status);
    //   });

    // };

    // function InstagramUser1(_this,user_tag,is_tag,host,tag,username,limit,dtid,source) {

    //   var url = is_tag ? host + "explore/tags/"+ tag : host + username,
    //       url = url +'/?__a=1';

    //   $.getJSON(url, function(data){

    //       try{
    //           data = data.graphql.hashtag.edge_hashtag_to_media.edges;
    //       }catch(e){
    //           console.error("Instagram Feed:error __a=1");
    //           return;
    //       }
    //       ins_js(_this,data,true,user_tag,limit,dtid,source);

    //   }).fail(function(e){
    //     _this.parent().addClass('ins_loaded');
    //     console.error("Instagram Feed: __a=1 status code: ", e.status);
    //   });
    // };

   //  function ins_js(_this,data,bl,user_tag,limit,dtid,source) {
   //    //console.log(data);
   //    //data = JSON.parse(data); 
   //    //console.log(data);
   //    var html = '',
   //        bl = bl || true,
   //        cl = _this.data('cl'),
   //        cltb = _this.data('cltb'),
   //        clmb = _this.data('clmb'), 
   //        target = _this.data('target');

   //      //_this.html(data);

   //      // if (display_profile){
   //      //  console.log(data.biography)
   //      // }
   //     //console.log(data);
   //     //  try {
   //     //     data = data[0].node;
   //     //     var noTEAapi = true
   //     // } catch(e){
   //     //     var noTEAapi = false
   //     // }
   //     if(typeof data.is_private !== "undefined" && data.is_private === true && source == '3') {
   //          _this.html("<p class='instagram_private'><strong>This profile is private</strong></p>").parent().addClass('ins_loaded');
   //          return false;
   //     }

   //     if (source == '1') {

   //        $.each(data, function (index, el) {
   //           if (index >= limit) return 0;
   //           //console.log(el);
   //           html += '<div class="cl_nt_'+index+' col_ins col-'+clmb+' col-md-'+cltb+' col-lg-'+cl+' item pr"><a data-no-instant rel="nofollow" class="db pr oh" href="'+el.link+'" target="' + target + '"><div class="lazyload nt_bg_lz pr_lazy_img" data-bgset="' + el.images.thumbnail.url + ' 150w,' + el.images.low_resolution.url + ' 320w,' + el.images.standard_resolution.url + ' 640w" data-sizes="auto"></div><div class="info pa tc flex ts__03 fl_center al_center op__0 t__0 l__0 r__0 b__0 h__100 pe_none"><span class="pr cw mr__5 ml__5"><i class="facl facl-heart-o mr__5"></i>'+el.likes.count+'</span><span class="pr cw"><i class="facl facl-comments-o mr__5"></i>'+el.comments.count+'</span></div></a></div>';
   //        });

   //     } else if (source == '2') {

   //        $.each(data, function (index, el) {
   //           if (index >= limit) return 0;
   //           //console.log(el);
   //           var img_url = el.thumbnail_url || el.media_url;
   //           html += '<div class="cl_nt_'+index+' col_ins col-'+clmb+' col-md-'+cltb+' col-lg-'+cl+' item pr"><a data-no-instant rel="nofollow" class="db pr oh" href="'+el.permalink+'" target="' + target + '"><div class="lazyload nt_bg_lz pr_lazy_img" data-bg="' + img_url + '" data-sizes="auto"></div><div class="info pa tc flex ts__03 fl_center al_center op__0 t__0 l__0 r__0 b__0 h__100 pe_none like_t4ins'+el.like_count+' cms_t4ins'+el.comments_count+'"><span class="pr cw mr__5 ml__5"><i class="facl facl-heart-o mr__5"></i>'+el.like_count+'</span><span class="pr cw"><i class="facl facl-comments-o mr__5"></i>'+el.comments_count+'</span></div></a></div>';
   //        });

   //     } else {

   //        var imgs = (data.edge_owner_to_timeline_media || data.edge_hashtag_to_media).edges;
   //        //console.log(imgs);
   //        $.each(imgs, function (index, element) {
   //           if (index >= limit) return 0;
   //           //console.log(element.node);
   //           var el = element.node;
   //           html += '<div class="cl_nt_'+index+' col_ins col-'+clmb+' col-md-'+cltb+' col-lg-'+cl+' item pr"><a data-no-instant rel="nofollow" class="db pr oh" href="//instagram.com/p/'+el.shortcode+'" target="' + target + '"><div class="lazyload nt_bg_lz pr_lazy_img" data-bgset="' + el.thumbnail_resources[0].src + ' 150w,' + el.thumbnail_resources[1].src + ' 240w,' + el.thumbnail_resources[2].src + ' 320w,' + el.thumbnail_resources[3].src + ' 480w,' + el.thumbnail_resources[4].src + ' 640w" data-sizes="auto"></div><div class="info pa tc flex ts__03 fl_center al_center op__0 t__0 l__0 r__0 b__0 h__100 pe_none"><span class="pr cw mr__5 ml__5"><i class="facl facl-heart-o mr__5"></i>'+el.edge_liked_by.count+'</span><span class="pr cw"><i class="facl facl-comments-o mr__5"></i>'+el.edge_media_to_comment.count+'</span></div></a></div>';
   //        });

   //     }

   //      //console.log(html);
   //      _this.html(html).parent().addClass('ins_loaded');
   //      if ( !_this.hasClass('js_carousel')) return;
   //      geckoShopify.refresh_flickity(_this);

   //      if (sp_nt_storage && bl) { 
   //         sessionStorage.setItem('nt_ins'+user_tag+dtid, html);
   //         sessionStorage.setItem('nt_ins'+user_tag, JSON.stringify(data));
   //      }
   // };

    geckoShopify.instagram = function () {
      if ( $(".js_nt_ist").length == 0 ) return;
      
      $(".js_nt_ist").each(function (index) {
         geckoShopify.refresh_ins($(this));
      });
    };

})( jQuery_T4NT );

jQuery_T4NT(document).ready(function($) {
  geckoShopify.instagram();

  $('.js_sidebar').on('lazyincluded', function(e) {
    // console.log('js_sidebar load')
    geckoShopify.instagram();
    $('body').trigger('refresh_currency'); 
  });
});