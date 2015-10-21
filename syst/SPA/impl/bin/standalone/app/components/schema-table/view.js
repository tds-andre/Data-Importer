var app = app || {};
(function ($) {

	'use strict';	

	app.SchemaTableView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		
		events: {
			//'click  .js-??????-button'  : 'buttonClicked',			
		},		
		
		defaults: {
			fetched: false
		},	

		template: _.template($('#schema-table-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			this.options = {};
		},		

		render: function () {
			this.$el.html(this.template());
			this.$list = $('.js-items', this.$el)	;
			return this;			
		},

		start: function(options){
			$.extend(true, this.options, this.defaults, options);
			this.render();
			if(this.options.fetched){
				this.addAll;
			}
			else{
				this.collection.reset();
				this.listenTo(this.collection, 'reset', this.addAll);
				this.collection.fetch({reset: true});
			}			
			return this;		
		},

		// View callbacks------------------------------------------------------------------ //
		// -------------------------------------------------------------------------------- //

		

		// Other callbacks----------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		addAll: function(){		
			this.collection.each(this.addItem, this)
		},

		addItem: function(item){
			var view = new app.SchemaTableItemView({model: item});
			this.$list.append(view.start().el);
		}

		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

	});
})(jQuery);