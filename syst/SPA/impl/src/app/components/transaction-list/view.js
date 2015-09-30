var app = app || {};
(function ($) {

	'use strict';	

	app.TransactionListView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		
		events: {
			'click  .js-new'  : 'newClicked',			
		},

		options: {
			actions:["edit","detail","delete"],
			showHeader: true,
			fetched: false
		},	

		template: _.template($('#transaction-list-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			
		},		

		render: function () {
			
			this.$el.html(this.template());	
			if(!this.options.showHeader){
				this.$el.html($(".js-main", this.$el).html());
			}
			
			return this;			
		},

		start: function(options){
			this.options = _.extend(this.options, options);
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
			})
			
		},

		addAll: function(){
			this.$list.html('');
			this.collection.each(this.addOne, this);
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