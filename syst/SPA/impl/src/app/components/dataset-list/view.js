var app = app || {};
(function ($) {

	'use strict';	

	app.DatasetListView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		
		events: {
			//'click  .js-??????-button'  : 'buttonClicked',			
		},		
		
		options: {
			isSource: true
		},	

		template: _.template($('#dataset-list-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			
		},		

		render: function () {			
			this.$el.html(this.template({}));			
			return this;			
		},

		start: function(options){
			this.collection.fetch();
			this.render();		
		},

		// Events ------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		buttonClicked: function(ev){},		

		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

	});
})(jQuery);