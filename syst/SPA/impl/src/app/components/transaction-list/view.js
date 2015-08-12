var app = app || {};

(function ($) {

	'use strict';	

	app.TransactionListView = Backbone.View.extend({



		el: '#transaction-list-placeholder',

		template: _.template($('#transaction-list-template').html()),

		events: {
			'keypress #new-todo': 'createOnEnter',
			'click #clear-completed': 'clearCompleted',
			'click #toggle-all': 'toggleAllComplete'
		},

		initialize: function () {
			//this.collection = new app.TransactionCollection();
			this.$list = function(){return $("tbody",this.$el);} ;
			//this.listenTo(this.collection, 'sync', this.addAll);
			//this.listenTo(this.collection, 'reset', this.addAll);		
			this.listenTo(this.collection, 'innersync', this.addAll);
			this.render();			
			this.collection.fetch({reset: true});
			
		},

		render: function () {
			this.$el.html(this.template);
			//this.$list = $("tbody",this.$el)
		},

		// Add a single transaction item to the list by creating a view for it, and
		// appending its element to the `<tbody>`.
		addOne: function (transaction) {
			var view = new app.TransactionItemView({ model: transaction });
			this.$list().append(view.render().el);
			this.listenTo(view, 'selected', this.triggerSelected);
		},

		// Add all transactions in the transactions collection at once.
		addAll: function () {
			this.$list().html('');
			this.collection.each(this.addOne, this);
		},

		triggerSelected: function (transaction) {
			this.trigger('selected', transaction);
			console.log(transaction);
		},

		filterAll: function () {
			this.collection.each(this.filterOne, this);
		}

	});

	console.log("transaction list view loaded");
})(jQuery);
