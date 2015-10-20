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
		
		defaults: {
			type: "source"
		},	

		template: _.template($('#dataset-list-item-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			this.options = {};
		},		

		render: function () {
			var
				json = this.model.toJSON();			
			json.conector = app.DatasetTypeEnum.byPath(this.model.get("typePath")).caption
			this.$el.html(this.template(json));			
			return this;			
		},

		start: function(options){
			$.extend(true, this.options, this.defaults, options);
			
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
		}

		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		

	});
})(jQuery);