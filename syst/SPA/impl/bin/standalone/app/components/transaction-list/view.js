var app = app || {};
(function ($) {

	'use strict';	

	app.TransactionListView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		
		events: {
			'click  .js-new'  : 'newClicked',			
		},

		defaults: {
			actions:["edit","detail","delete"],
			showHeader: true,
			fetched: false
		},	

		template: _.template($('#transaction-list-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			this.options = {};
		},		

		render: function () {
			
			this.$el.html(this.template());	
			if(!this.options.showHeader){
				this.$el.html($(".js-main", this.$el).html());
			}
			
			return this;			
		},

		start: function(options){
			$.extend(this.options, this.defaults, options);
			this.render();
			this.$list = $(".js-list", this.$el);
			if(!this.options.fetched){
				this.listenTo(this.collection, "reset", this.addAll);
				this.collection.fetch({reset: true});	
			}else{
				this.addAll();
			}
		},

		// View callbacks------------------------------------------------------------------ //
		// -------------------------------------------------------------------------------- //

		newClicked: function(ev){
			this.trigger("new");
		},

		// Other callbacks----------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		addOne: function (dataset) {
			var 
				view = new app.TransactionListItemView({ model: dataset }),
				self = this;
			view.start(this.options);
			this.$list.append(view.render().el);
			view.on("details", function(view){self.trigger("details",view)});
			view.on("edit", function(view){self.trigger("edit",view)});
			view.on("delete", function(view){
				view.remove();
				self.trigger("delete");
			});
			view.on("link", function(view){
				self.trigger("link", view);
			});
			view.on("favorite", function(view){
				self.trigger("favorite", view);
			})
			
		},

		addAll: function(collection){
			collection = collection || this.collection;
			this.$list.html('');
			if(collection.each)
				collection.each(this.addOne, this);
			else
				collection.forEach(this.addOne, this);
		},

		filter: function(fn){
			this.addAll(this.collection.filter(fn))
		}

		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

	});
	app.TransactionListView.prototype.ActionsEnum = {
		"delete": {},
		"edit": {},
		"detail": {},
		"favorite": {}
	}
})(jQuery);