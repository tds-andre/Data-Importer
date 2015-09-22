var app = app || {};
(function ($) {

	'use strict';	

	app.DatasetListItemView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		tagName: "tr",
		data:{
			source:{
				lower: "a origem"
			},
			target: {
				lower: "o destino"
			}
		},
		events: {
			'click  .js-new-dataset-list-item-details'  : 'detailsClicked',
			'click  .js-new-dataset-list-item-edit'  : 'editClicked',
			'click  .js-new-dataset-list-item-delete'  : 'deleteClicked'
		},		
		
		options: {
			type: "source"
		},	

		template: _.template($('#dataset-list-item-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			
		},		

		render: function () {
			var
				json = this.model.toJSON();
			this.listenTo(this.model.get("server"), "change", this.updateHost)
			json.conector = app.DatasetTypeEnum.byPath(this.model.get("typePath")).caption
			this.$el.html(this.template(json));			
			return this;			
		},

		start: function(options){
			this.options = _.extend(this.options, options);
			
		},

		// Events ------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		detailsClicked: function(ev){
			this.trigger("details",this);
		},
		editClicked: function(ev){
			this.trigger("edit",this);
		},
		deleteClicked: function(ev){
			var
				self = this;
			bootbox.confirm("Tem certeza que deseja excluir "+this.data[this.options.type].lower +" "+this.model.get("name")+" ?", function (result) {
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

		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		updateHost: function(){
			$(".js-new-dataset-list-item-host", this.$el).html(this.model.get("server").get("host"));
		}

	});
})(jQuery);