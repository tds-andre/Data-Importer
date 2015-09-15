var app = app || {};
(function ($) {

	'use strict';	

	app.NewDatasetView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		
		events: {
			'click .js-new-dataset-edit-button'  : 'editClicked',
			'click  .js-new-dataset-save-button'  : 'saveClicked'
			'click  .js-new-dataset-cancel-button'  : 'cancelClicked'
		},		
		
		options: {
			isNew: true,
			isSource: true,
			showHeader: true,
			isEditable: false
		},

		isEditing: true,

		template: _.template($('#new-dataset-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			
		},		

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this;			
		}

		start: function(options){
			var 
				tmp = _.extend(this.options, options);
			this.options = tmp;
			if(this.options.isNew)
				this.model = new app.DatasetModel();
			this.render();
		},

		// Events ------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		this.cancelClicked = function(ev){};
		this.saveClicked = function(ev){};
		this.editClicked = function(ev){};

	});
})(jQuery);