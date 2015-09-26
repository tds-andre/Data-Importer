var app = app || {};
(function ($) {

	'use strict';	

	app.TransactionCreateUpdateView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		
		events: {
			'change  .js-radio'  : 'radioChanged',			
		},		
		
		options: {
			
		},	

		hash: null,

		stepContentId: null,

		newOriginView: null,

		existingOriginView: null,

		newTargetView: null,

		existingTargetView: null,

		$steps: [],

		template: _.template($('#transaction-create-update-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			
		},		

		render: function () {
			this.$el.html(this.template());				
			$(".js-transaction-create-update-wizard",this.$el).wizard();
			return this;		
		},

		start: function(options){
			this.options = _.extend(this.options, options)
			this.render();
			return this;		
		},

		// Events ------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		radioChanged: function(ev){
			switch($(ev.currentTarget).val()){
				case "new-origin":
					this.showExisting(this.newOriginView, true);
					break;
				case "existing-origin":
					$(".js-transaction-create-update-target-list").slideDown();
					break;
				case "new-target":
					this.showExisting(this.newTargetView, false);
					break;
				case "existing-target":
					$(".js-transaction-create-update-target-list").slideDown();
					break;
				default:
					console.log($(ev.currentTarget).val());
			}	
		},	

		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		showExisting: function(view, isSource){
			var
				caption = isSource? "origin" : "target";

			$(".js-transaction-create-update-"+caption+"-existing").hide();					
			if(view){						
				view.$el.show();
			}else{						
				view= new app.DatasetCreateUpdateView({el: $(".js-transaction-create-update-"+caption+"-new")[0]});
				view.start({showHeader:false, isSource: isSource});
				view.$el.show()
			}
		}

	});
})(jQuery);