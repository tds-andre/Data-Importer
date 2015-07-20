var app = app || {};

(function ($) {

	'use strict';	

	app.StartTransactionView = Backbone.View.extend({



		el: '#transaction-list-placeholder',

		template: _.template($('#start-transaction-template').html()),


		initialize: function () {			
			this.render();	
		},

		render: function () {
			this.$el.html(this.template);
			
		},
		

	});

	console.log("start transaction view loaded");
})(jQuery);
