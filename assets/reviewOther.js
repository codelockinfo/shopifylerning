// DOCUMENT https://kalles-docs.the4.co/features/custom-review-app#custom-review-apps
(function( $ ) {
   "use strict";

   geckoShopify.reviewOther = function () {
   	$('body').on('reviewOther', function () {
   		
      // any code css
      // 1. Areviews - Reviews Importer
      // if ($('.areviews_product_item').length > 0 && typeof show_infiniti_areviews === 'function'){show_infiniti_areviews();}

      // 2. Yotpo
	    // if(typeof window.Yotpo !== 'undefined'){
	    //   if(window.Yotpo !== null){
	    //     var api = new window.Yotpo.API(yotpo);
	    //     api.refreshWidgets();
	    //   }
	    // }

    });
   };


})( jQuery_T4NT );

jQuery_T4NT(document).ready(function($) {
  geckoShopify.reviewOther();
});

