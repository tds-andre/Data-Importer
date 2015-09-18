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
		saveClicked: function(ev){
			var
				name = $(".js-new-dataset-name"),
				col;
			if(name==""){
				this.trigger("error",{message: "Nomo não pode ser vazio!"});
				return;
			}
			if(app.isDefined(datasetType)){
				this.trigger("error",{message: "Selecione o conector!"});
				return;
			}

			this.model = new app.DatasetTypeEnum[this.datasetType].model();
			this.model.set("name", name);
			switch(this.datasetType){
				case "csv":
					this.model.set("fieldSeparator", );
					this.model.set("lineSeparator", )
				/*this.model.save({ 
						name: name,
						fieldSeparator: $(".js-new-dataset-csv-field-separator") ,
						lineSeparator: $(".js-new-dataset-csv-line-separator")
					}, 
					{
						success: function(s){
							this.trigger("new", this.model);
						}, 
						error: function(a,b,c) {
							this.trigger("error", {model: this.model, message: "Error ao salvar dataset"});
						}
					});*/
					break;
				case "solr":
					break;
			}
		},
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