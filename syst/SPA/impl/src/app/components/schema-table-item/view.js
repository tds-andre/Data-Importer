var app = app || {};
(function ($) {

	'use strict';	

	app.SchemaTableItemView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		tagName: 'tr',


		events: {
			//'click  .js-??????-button'  : 'buttonClicked',			
		},		
		
		defaults: {
			
		},	

		template: _.template($('#schema-table-item').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			this.options = {};
		},		

		render: function () {
			var json = this.model.toJSON();
			this.$el.html(this.template(json));			
			return this;			
		},

		start: function(options){
			$.extend(true, this.options, this.defaults, options);
			this.render();
			return this;		
		},

		// View callbacks------------------------------------------------------------------ //
		// -------------------------------------------------------------------------------- //

		buttonClicked: function(ev){}

		// Other callbacks----------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

	});
})(jQuery);