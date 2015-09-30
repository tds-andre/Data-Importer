var app = app || {};
(function ($) {

	'use strict';	

	app.TransactionTabsView= Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		
		events: {
			//'click  .js-??????-button'  : 'buttonClicked',			
		},		
		
		options: {
			
		},	

		views:{
			recent: null,
			all:null,
			favorite: null
		},

		template: _.template($('#transaction-tabs-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			
		},		

		render: function () {
			var
				recentCollection = new app.TransactionCollection(),
				allCollection = new app.TransactionCollection();		
			this.listenTo(recentCollection, "reset", this.renderRecent);
			this.listenTo(allCollection, "reset", this.renderAll);
			this.listenTo(allCollection, "reset", this.renderFavorite);
			
			recentCollection.fetch({url: "http://localhost:8090/transaction/search/recent", reset: true});
			allCollection.fetch({ reset: true});

			this.$el.html(this.template());
			this.views.recent = new app.TransactionListView({el: $()})			
			return this;			
		},

		start: function(options){
			this.options = _.extend(this.options, options);
			this.render();
			return this;		
		},

		// View callbacks------------------------------------------------------------------ //
		// -------------------------------------------------------------------------------- //

		

		// Other callbacks----------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		renderRecent: function(elements){
			this.views.recent = new app.TransactionListView({el: $(".js-recent-el",this.$el)[0], collection: elements})
			this.views.recent.start({fetched: true, showHeader: false, actions:["detail", "favorite"]});

		},
		renderAll: function(elements){
			this.views.all = new app.TransactionListView({el: $(".js-all-el",this.$el)[0], collection: elements})
			this.views.all.start({fetched: true, showHeader: false, actions:["detail", "favorite"]});
		},
		renderFavorite: function(elements){
			var
				favCol = new app.TransactionCollection();
			elements = elements.filter(function(el){return el.get("isFavorite");});
			favCol.add(elements);
			this.views.favorite = new app.TransactionListView({el: $(".js-favorite-el",this.$el)[0], collection: favCol})
			this.views.favorite.start({fetched: true, showHeader: false, actions:["detail", "favorite"]});
		},

		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

	});
})(jQuery);