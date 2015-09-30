var app = app || {};
(function ($) {

	'use strict';	

	app.TransactionDetailsView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		
		events: {
			
		},		
		
		options: {
			
		},	

		views:{
			source: null,
			target: null
		},

		template: _.template($('#transaction-details-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			
		},		

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			this.views.source = new app.DatasetDetailsView({el: $(".js-source-el", this.$el)[0], model: this.model.get("sourceDataset")})
			this.views.target = new app.DatasetDetailsView({el: $(".js-target-el", this.$el)[0], model: this.model.get("targetDataset")})
			this.views.source.start();
			this.views.target.start();
			return this;			
		},

		start: function(options){
			this.options = _.extend(this.options, options);
			this.render();
			return this;		
		},

		// View callbacks------------------------------------------------------------------ //
		// -------------------------------------------------------------------------------- //
		

		// Other callbacks----------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

	});
})(jQuery);