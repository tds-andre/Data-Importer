var app = app || {};

(function ($) {
	'use strict';
	app.TransactionItemView = Backbone.View.extend({
		template: _.template($('#transaction-item-template').html()),
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});
	console.log("transaction item view loaded");
})(jQuery);