var app = app || {};
(function ($) {

	'use strict';	

	app.##class-name## = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		
		events: {
			//'click  .js-??????-button'  : 'buttonClicked',			
		},		
		
		options: {
			
		},	

		template: _.template($('##template-id##').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			
		},		

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));			
			return this;			
		},

		start: function(options){
			this.options = _.extend(this.options, options);
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