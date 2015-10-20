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
			'click  .js-delete'  : 'deleteClicked',
			'click  .js-favorite'  : 'favoriteClicked',
			'click  .js-link'      : 'linkClicked'
		},		
		
		defaults: {		
			actions:["edit","detail","delete"]
		},	

		template: _.template($('#transaction-list-item-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			this.options = {};
		},		

		render: function () {
			var
				json = this.model.toJSON();
			json.actions = this.options.actions;
			this.listenTo(this.model.get("sourceDataset"), "change:name", this.updateSource)
			this.listenTo(this.model.get("targetDataset"), "change:name", this.updateTarget)
			this.listenTo(this.model, "change:isFavorite", this.favoriteChanged)
			this.$el.html(this.template(json));
			return this;			
		},

		start: function(options){
			$.extend( this.options, this.defaults, options);
			this.model.nestedFetch();
			return this.render();		
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
		favoriteClicked: function(e){
			//this.model.set("isFavorite", this.model.get("isFavorite"));
			var
				fav = !this.model.get("isFavorite"),
				self = this;

			app.collections.transaction.patch(this.model, {isFavorite: fav}, {
				success: function(e){
					self.model.set("isFavorite", fav)
					self.updateFavorite();
					self.trigger("favorite");
				},
				error: function(e){

				}
			});
			
			this.trigger("favorite", this);
		},

		linkClicked: function(e){
			this.trigger("link", this);
		},

		// Other callbacks----------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //


		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		updateFavorite: function(){
			if(this.model.get("isFavorite")){
				$(".js-favorite", this.$el).removeClass("bg-gray");
				$(".js-favorite", this.$el).addClass("bg-gold");
			}else{
				$(".js-favorite", this.$el).removeClass("bg-gold");
				$(".js-favorite", this.$el).addClass("bg-gray");
			}
		},

		updateTarget: function(){
			$(".js-target-name", this.$el).html(this.model.get("targetDataset").get("name"));
		},
		updateSource: function(){
			$(".js-source-name", this.$el).html(this.model.get("sourceDataset").get("name"));
		}, 

		

	});
})(jQuery);