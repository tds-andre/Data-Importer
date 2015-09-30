var app = app || {};
(function ($) {

	'use strict';	

	app.DatasetDetailsView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		tagName: "div",
		events: {
			//'click  .js-??????-button'  : 'buttonClicked',			
		},		
		
		options: {
			
		},	

		template: _.template($('#dataset-details-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			
		},

		serverTwice: function(){
			console.log("TransactionDetailsView.serverTwice, server: ", jQuery.extend({}, this.model.get("server").attributes));
			this.render();
		},

		serverOnce: function(){
			console.log("TransactionDetailsView.serverOnce, server: ", jQuery.extend({}, this.model.get("server").attributes));
			this.listenTo(this.model.get("server"), "sync", this.serverTwice);
		},

		render: function () {
			if(!app.isDefined(this.model.get("server"))){
				this.listenToOnce(this.model, "change:server", this.serverOnce)
				//this.listenTo(this.model, "change:server", this.serverTwice)
				this.model.nestedFetch();
				return;
			}
			var

				json = this.model.toJSON(),
				typePath = json.typePath || this.model.typePath,
				key = app.DatasetTypeEnum.byPath(typePath,true);
			json.conector = app.DatasetTypeEnum[key].caption;

			
			
			this.$el.html(this.template(json));
			
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