var app = app || {};
(function ($) {

	'use strict';	

	app.NewDatasetView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		
		events: {
			//'click  .js-new-dataset-edit-button'  : 'editClicked',
			'click  .js-new-dataset-save'  : 'saveClicked',
			'click  .js-new-dataset-cancel'  : 'cancelClicked',
			'input  .js-new-dataset-type' : 'datasetTypeSelected'
		},		
		
		options: {
			isNew: true,
			isSource: true,
			showHeader: true,
			isEditable: false
		},

		datasetType: null,

		isEditing: true,

		template: _.template($('#new-dataset-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			
		},		

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			this.hideFieldsets();
			return this;			
		},

		start: function(options){
			var 
				i = 0,
				$select,
				tmp = _.extend(this.options, options);

			this.options = tmp;
			if(this.options.isNew)
				this.model = new app.DatasetModel();
			this.render();
			$select = $(".js-new-dataset-type");
			$select.html("<option disabled selected> -- Selecione -- </option>");
			if(this.options.isSource){
				for(i = 0; i < app.SourceableDatasetTypes.length; i++){
					$select.append(this.genOption(app.SourceableDatasetTypes[i]));
				}
			}
			else{
				for(i = 0; i < app.TargetableDatasetTypes.length; i++){
					$select.append(this.genOption(app.TargetableDatasetTypes[i]));
				}
			}

		
		},

		// Events ------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		cancelClicked: function(ev){},
		saveClicked: function(ev){},
		editClicked: function(ev){},
		datasetTypeSelected: function(ev){
			this.datasetType = $(ev.currentTarget).val();
			this.renderDatasetTypeFieldset(this.datasetType);
		},

		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		renderDatasetTypeFieldset: function(datasetType){
			var
				ord = app.DatasetTypeEnum[datasetType].ordinal;
			this.hideFieldsets();
			switch(datasetType){
				case "csv":
					this.showCsvFieldset();
					break;
				case "solr":
					this.showSolrFieldset();
					break;
			}
			

		},

		showCsvFieldset: function(){
			$(".js-new-dataset-csv-fieldset").show();
		},

		showSolrFieldset: function(){
			alert("Método NewDatasetView.showSolrFieldset não implementado!");
		},

		hideFieldsets: function(){
			$(".js-new-dataset-fieldset").hide();
		},

		genOption: function(value){
			return "<option value='"+value+"'>"+app.DatasetTypeEnum[value].caption+"</option>";
		}

	});
})(jQuery);