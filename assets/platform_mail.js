(function( $ ) {
   "use strict";
      geckoShopify.PlatformMail = function () {

         if (nt_settings.platform_email == '4') {
			  $(".nt_ajax_mcsp").submit(function(e) {
			    e.preventDefault();
			    var $form = $(this).closest('form'),
			        $result = $form.find('.mc4wp-response'),
			        $button = $form.find('[type="submit"]');

             $button.addClass('loading'); 
		         $.ajax({
		            type: "GET",
		            url: $form.attr('action'),
		            data: $form.serialize(),
		            cache: false,
		            dataType: 'jsonp',
		            jsonp: "c",
		            contentType: "application/json; charset=utf-8",
		            error: function (err) {
		               $button.removeClass('loading');
						try {
						   var messenger = err.replace('0 - ', '').replace('1 - ', '').replace('2 - ', '');
			               $result.html('<div class="shopify-error">' + messenger + '</div>').slideDown(100);
						}
						catch(err) {
						}
		            },
		            success: function (data) {
		               $button.removeClass('loading');
						try {
			               var messenger = data.msg.replace('0 - ', '').replace('1 - ', '').replace('2 - ', '');
			               if (data.result != "success") {
			                  //$result.find('.success_message').html('<div class="shopify-warning"><i class="las la-exclamation-triangle"></i>' + messenger + '</div>').slideDown(100);
			                  $result.find('.error_message').html(messenger);
			                  $result.find('.shopify-warning').slideDown(100);
			               } else {
			                  //$result.html('<div class="shopify-message"><i class="las la-check"></i>' + messenger + '</div>').slideDown(100);
			                  $result.find('.success_message').slideDown(100);
			               }
						}
						catch(err) {
						}
		            }
		         });
			      //return false;

			   });
			  
         } else {
	            //https://help.klaviyo.com/hc/en-us/articles/115005249588-Add-and-Customize-a-Legacy-Embedded-Signup-Form
				$script(JSNTT4.data('klaviyo'), function() {

				  $.each($('.klaviyo_sub_frm'), function(){
				  	var brand = $(this).attr('brand') || 'Kalles Klaviyo';
				    KlaviyoSubscribe.attachToForms('#'+$(this).attr('id'), {
				      custom_success_message: true,
				      extra_properties: {$source: 'NewsletterPopup',Brand: brand},
				      success: function ($form) {
				        $form.find('[type="submit"]').removeClass('loading');
				      }
				    });
				  });

				  $(".nt_ajax_klsp").submit(function(e) {
				  	var $form = $(this).closest('form'),
				  	    $button = $form.find('[type="submit"]');
				         $button.addClass('loading')
				  });
				  $('body').on( "klaviyo.subscribe.success klaviyo.subscribe.error",  function(e){
				  	//console.log('klaviyo.subscribe.success')
				    $(e.target).find('[type="submit"]').removeClass('loading');
				  });

				});
         }

      };
})( jQuery_T4NT );

jQuery_T4NT(document).ready(function($) {
  geckoShopify.PlatformMail();
});