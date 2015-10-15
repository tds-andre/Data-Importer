var app = app || {};
(function ($) {

	'use strict';	

	app.DatasetDetailsView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		tagName: "div",
		events: {
			
		},				

		template: _.template($('#dataset-details-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			this.options = {};
		},

		serverSynced: function(){
			console.log("TransactionDetailsView.serverTwice, server: ", jQuery.extend({}, this.model.get("server").attributes));
			this.render();
		},

		serverCreated: function(){			
			this.listenTo(this.model.get("server"), "sync", this.serverSynced);
		},

		render: function () {
			if(!app.isDefined(this.model.get("server"))){
				this.listenToOnce(this.model, "change:server", this.serverCreated);				
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
			$.extend(true,this.options, this.defaults, options);
			return this.render();				
		},

		// Events ------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		

		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

	});
})(jQuery);