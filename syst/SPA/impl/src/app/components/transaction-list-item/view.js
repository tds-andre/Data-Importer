var app = app || {};
(function ($) {

	'use strict';	

	app.TransactionListItemView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		tagName: 'tr',
		events: {
			'click  .js-edit'  : 'editClicked',
			'click  .js-details'  : 'detailsClicked',
			'click  .js-delete'  : 'deleteClicked'
		},		
		
		options: {
			
		},	

		template: _.template($('#transaction-list-item-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			
		},		

		render: function () {			
			this.listenTo(this.model.get("sourceDataset"), "change:name", this.updateSource)
			this.listenTo(this.model.get("targetDataset"), "change:name", this.updateTarget)			
			this.$el.html(this.template(this.model.toJSON()));
			return this;			
		},

		start: function(options){
			this.options = _.extend(this.options, options);			
			return this;		
		},

		// View callbacks------------------------------------------------------------------ //
		// -------------------------------------------------------------------------------- //

		detailsClicked: function(e){
			this.trigger("details", this);
		},
		deleteClicked: function(e){
			var
				self = this;
			bootbox.confirm("Tem certeza que deseja excluir a transação "+this.model.get("name")+" ?", function (result) {
				if (result) {
					self.model.destroy({
						success:function(ev){
							self.trigger("delete",self);
						},
						error: function(a,b,error){
							self.trigger("error",{view: self, message:error});
						}
					})
				}
			});
		},
		editClicked: function(e){
			this.trigger("edit", this);
		},

		// Other callbacks----------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //


		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		updateTarget: function(){
			$(".js-target-name", this.$el).html(this.model.get("targetDataset").get("name"));
		},
		updateSource: function(){
			$(".js-source-name", this.$el).html(this.model.get("sourceDataset").get("name"));
		}

	});
})(jQuery);