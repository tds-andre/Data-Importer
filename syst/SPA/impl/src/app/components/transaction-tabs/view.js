var app = app || {};
(function ($) {

	'use strict';	

	app.TransactionTabsView= Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		
		events: {
			'click  .js-filter-all'  : 'showAll',
			'click  .js-filter-recent'  : 'showRecent',
			'click  .js-filter-favorite'  : 'showFavorite',
		},		
		
		defaults: {
			
		},	

		

		template: _.template($('#transaction-tabs-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			this.options = {}
			this.listView = null;
		},		

		render: function () {			
			this.$el.html(this.template());
			this.listView = new app.TransactionListView({el: $(".js-list-el", this.$el)[0], collection: this.collection});
			this.listView.start({fetched: true, showHeader: false, actions:["detail", "favorite"]});
			this.showFavorite();
			return this;			
		},

		start: function(options){
			$.extend(true, this.options, this.defaults, options);
			var
				self = this;
			this.recent = new app.TransactionCollection();
			this.collection = new app.TransactionCollection();		
						
			this.recent.fetch({url: "http://localhost:8090/transaction/search/recent", reset: true, success:function(){				
				self.collection.fetch({reset: true, success: function(){
					self.merge();
					self.render();
				}});
			}});
			
			return this;		
		},

		// View callbacks------------------------------------------------------------------ //
		// -------------------------------------------------------------------------------- //
		showAll: function(){
			this.listView.filter(function(model){return true});
		},
		showRecent: function(){
			this.listView.filter(function(model){return model.isRecent});
		},
		showFavorite: function(){
			this.listView.filter(function(model){return model.get("isFavorite")});
		},
		

		// Other callbacks----------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		

		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		merge: function(){
			var ids = this.recent.map(function(model){return model.idd})
			this.collection.filter(function(model){return (ids.indexOf(model.idd)>-1)}).forEach(function(model){model.isRecent = true})
		}

	});
})(jQuery);