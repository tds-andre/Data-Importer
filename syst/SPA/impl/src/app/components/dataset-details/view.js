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

		render: function () {
			var
				json = this.model.toJSON(),
				key = app.DatasetTypeEnum.byPath(json.typePath,true);
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