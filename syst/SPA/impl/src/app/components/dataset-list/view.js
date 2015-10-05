var app = app || {};
(function ($) {

	'use strict';	

	app.DatasetListView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		data:{
			source:{
				button: "Nova Origem",
				title: "Origens"
			},
			target:{
				button: "Novo Destino",
				title: "Destinos"
			}
		},

		events: {
			'click  .js-new'  : 'newClicked',			
		},		
		
		defaults: {
			type: "source"
		},	

		template: _.template($('#dataset-list-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			this.options = {};
		},		

		render: function () {			
			this.$el.html(this.template(this.data[this.options.type]));			
			return this;			
		},

		start: function(options){
			$.extend(true, this.options, this.defaults, options);
			this.render();
			this.$list = $(".js-list");
			this.listenTo(this.collection, "reset", this.addAll);
			this.collection.reset();
			this.collection.fetch({reset: true});
					
		},

		// Events ------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //


		newClicked: function(ev){
			this.trigger("new",this);
		},		

		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		addOne: function (dataset) {
			var 
				view = new app.DatasetListItemView({ model: dataset }),
				self = this;
			view.start({type: this.options.type});
			this.$list.append(view.render().el);
			view.on("details", function(view){self.trigger("details",view)});
			view.on("edit", function(view){self.trigger("edit",view)});
			view.on("delete", function(view){
				view.remove();
				self.trigger("delete");
			})
			
		},

		addAll: function(){
			this.$list.html('');
			this.collection.each(this.addOne, this);
		}



	});
})(jQuery);