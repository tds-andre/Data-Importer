var app = app || {};

(function ($) {
	'use strict';
	app.TransactionItemView = Backbone.View.extend({
		tagName: 'tr',
		template: _.template($('#transaction-item-template').html()),
		events:{
			'click td:first-child a': 'triggerSelected'

		},
		triggerSelected: function(){
			this.trigger("selected", this.model);
		},
		initialize: function(){
			this.listenTo(this.model, 'change:name', this.updateName);
			this.listenTo(this.model.get('sourceDataset'), 'change:name', this.updateSourceName);
			this.listenTo(this.model.get('targetDataset'), 'change:name', this.updateTargetName);
			this.listenTo(this.model.get('mapping'), 'change:name', this.updateMappigName);
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		updateName: function(model, value){
			$("td:first-child a", this.$el).html(value);
		},
		updateSourceName: function(model, value){
			$("td:nth-child(2)", this.$el).html(value);
		},
		updateTargetName: function(model, value){
			$("td:nth-child(3)", this.$el).html(value);
		},
		updateMappingName: function(model, value){
			$("td:nth-child(4)", this.$el).html(value);
		}
	});
	console.log("transaction item view loaded");
})(jQuery);