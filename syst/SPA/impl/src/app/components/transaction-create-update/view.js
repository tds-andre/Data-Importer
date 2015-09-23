var app = app || {};
(function ($) {

	'use strict';	

	app.TransactionCreateUpdateView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		
		events: {
			//'click  .js-??????-button'  : 'buttonClicked',			
		},		
		
		options: {
			
		},	

		hash: null,

		$steps: [],

		template: _.template($('#transaction-create-update-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			
		},		

		render: function () {
			var
				$stepsContainer;

			this.hash = Math.random();
			 
			$stepsContainer = $(".js-transaction-create-udpate-steps", this.$el).prop("id","js-transaction-create-udpate-steps-"+this.hash);
			$(".js-transaction-create-udpate-actions",this.$el).prop("id","js-transaction-create-udpate-actions-"+this.hash);
			$(". js-transaction-create-update-step",this.$steps).each(function(index, el){
				$steps.push($(el).prop("id", "js-transaction-create-udpate-step-"+index+ "-"+this.hash));
			});

			this.$el.html(this.template());			
			return this;			
		},

		start: function(options){
			this.render();
			return this;		
		},

		// Events ------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		buttonClicked: function(ev){}	

		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

	});
})(jQuery);