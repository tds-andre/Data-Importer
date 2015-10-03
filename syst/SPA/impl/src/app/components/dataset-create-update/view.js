var app = app || {};
(function ($) {

	'use strict';	

	app.DatasetCreateUpdateView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		
		events: {			
			'click  .js-dataset-create-update-save'  : 'saveClicked',
			'click  .js-dataset-create-update-cancel'  : 'cancelClicked',
			'input  .js-dataset-create-update-conector' : 'datasetConectorSelected'
		},		
		
		defaults: {					
			isSource: true,
			showHeader: true		
		},

		datasetConector: null,
		isNew: null,
		isSaving: false,

		

		template: _.template($('#dataset-create-update-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			if(this.model)
				this.isNew = false;
			else
				this.isNew = true;
		},		

		render: function () {
			var
				$select, i;
			this.$el.hide();				
			this.$el.html(this.template());
			if(!this.options.showHeader){
				this.$el.html($(".js-main", this.$el).html());
			}
			this.$el.show();
			this.hideFieldsets();	
			$select = $(".js-dataset-create-update-conector", this.$el);
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
			if(!this.isNew)			
				this.update();
			return this;			
		},

		start: function(options){
			this.options = {}
			$.extend(true,this.options, this.defaults, options);
			this.render();			
			return this;
		
		},

		// Events ------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		cancelClicked: function(ev){
			this.trigger("cancel");
		},
		saveClicked: function(ev){
			var
				name = $(".js-dataset-create-update-name", this.$el).val(),				
				server,
				self = this;
			if(this.isSaving)
				return;
			this.isSaving = true;

			
			if(!app.isDefined(this.datasetConector)){
				this.trigger("error",{message: "Selecione o conector!"});
				return;
			}
			
			if(this.isNew){
				this.model = new app.DatasetTypeEnum[this.datasetConector].model();
			}

			this.model.set("name", name);
			switch(this.datasetConector){
				case "csv":
					this.model.set("fieldDelimiter", $(".js-dataset-create-update-csv-field-separator", this.$el).val());
					this.model.set("recordDelimiter", $(".js-dataset-create-update-csv-line-separator", this.$el).val());
					if(this.isNew){
						server = new app.LocalServerModel();
						server.set("name", name + " - Server");
						this.create(this.model,server,app.collections.csv,app.collections.localServer);
					}
					else{
						server = this.model.get("server");
						server.set("name", name + " - Server");
						this.update(this.model,server,app.collections.csv,app.collections.localServer);
					}
				break;
				case "solr":
					if(this.isNew)
						server = new app.LocalServerModel();
					else
						server = this.model.get("server");
					server.set("name", name + " - Server");
					this.model.set("location", $(".js-dataset-create-update-solr-core", this.$el).val());
					server.set("host", $(".js-dataset-create-update-solr-host", this.$el).val());
					server.set("port", $(".js-dataset-create-update-solr-port", this.$el).val());
					server.set("ftpPort", $(".js-dataset-create-update-solr-ftp", this.$el).val());
					if(this.isNew){						
						this.create(this.model,server,app.collections.solr,app.collections.solrServer);
					}
					else{						
						this.update(this.model,server,app.collections.solr,app.collections.solrServer);
					}					
					
				break;
			}
		},

		datasetConectorSelected: function(ev){
			this.datasetConector = $(ev.currentTarget).val();
			this.renderDatasetTypeFieldset(this.datasetConector);
		},

		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		renderDatasetTypeFieldset: function(){
			this.hideFieldsets();
			switch(this.datasetConector){
				case "csv":
					this.showCsvFieldset();
					break;
				case "solr":
					this.showSolrFieldset();
					break;
			}
			

		},

		showCsvFieldset: function(){
			$(".js-dataset-create-update-csv-fieldset", this.$el).show();
		},

		showSolrFieldset: function(){
			$(".js-dataset-create-update-solr-fieldset", this.$el).show()
		},

		hideFieldsets: function(){
			$(".js-dataset-create-update-fieldset", this.$el).hide();
		},

		hideHeaders: function(){
			$(".js-dataset-create-update-header", this.$el).hide();
		},

		genOption: function(value){
			return "<option value='"+value+"'>"+app.DatasetTypeEnum[value].caption+"</option>";
		},

		update: function(){
			this.datasetConector = app.DatasetTypeEnum.byPath(this.model.get("typePath"), true);
			$(".js-dataset-create-update-name",this.$el).val(this.model.get("name"));
			$('.js-dataset-create-update-conector option[value='+this.datasetConector+']', this.$el).attr('selected','selected');
			this.renderDatasetTypeFieldset();
			this.updateDatasetTypeFieldset()
		},
		updateDatasetTypeFieldset: function(){
			var
				csvLineSeparator;

			switch(this.datasetConector){
				case "csv":
					if(this.model.get("recordDelimiter")=="\r\n")
						$($('.js-dataset-create-update-csv-line-separator option', this.$el)[0]).attr('selected', 'selected')
					else
						$($('.js-dataset-create-update-csv-line-separator option', this.$el)[1]).attr('selected', 'selected')
					$(".js-dataset-create-update-csv-field-separator", this.$el).val(this.model.get("fieldDelimiter"));
					break;
				case "solr":
					$(".js-dataset-create-update-solr-host", this.$el).val(this.model.get("server").get("host"));
					$(".js-dataset-create-update-solr-core", this.$el).val(this.model.get("location"));
					$(".js-dataset-create-update-solr-port", this.$el).val(this.model.get("server").get("port"));
					$(".js-dataset-create-update-solr-ftp", this.$el).val(this.model.get("server").get("ftpPort"));
					break;
			}
			

		},

		create: function(dataset,server,datasetCollection,serverCollection){
			var
				self = this;
			server.on("invalid", function(){self.trigger("error", self)});
			dataset.on("invalid", function(){self.trigger("error", self)});
			serverCollection.persist(server,
				{
					success: function(e){						
						self.model.set("server", server.href);
						datasetCollection.persist(dataset, 
							{
								success: function(ee){
									self.trigger("new", self);
								}, 
								error: function(ee){
									self.trigger("error", self)
								}
							}
						);
					},
					error: function(e){
						self.trigger("error", self)
					}
				}
			);
		},
		udpate: function(model,server,datasetCollection,serverCollection){
			var 
				self = this;
			server.on("invalid", function(){self.trigger("error"), self});
			dataset.on("invalid", function(){self.trigger("error"), self});
			serverCollection.update(server,
				{
					success: function(e){						
						self.model.set("server", server.href);
						datasetCollection.update(dataset, 
							{
								success: function(ee){
									self.trigger("udpate", self);
								}, 
								error: function(ee){
									self.trigger("error", self)
								}
							}
						);
					},
					error: function(e){
						self.trigger("error", self)
					}
				}
			);
		}





	});
})(jQuery);