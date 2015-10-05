var app = app || {};
(function ($) {

	'use strict';	

	app.DatasetCreateUpdateView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		
		events: {			
			'click  .js-save'  : 'saveClicked',
			'click  .js-cancel'  : 'cancelClicked',
			'input  .js-conector' : 'datasetConectorSelected'
		},		
		
		defaults: {					
			isSource: true,
			showHeader: true					
		},		

		template: _.template($('#dataset-create-update-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			this.options = {}			
			this.isSaving= false;
			this.datasetConector= null;			
			this.isNew = true;
			if(this.model)
				this.isNew = false;
		},		

		render: function () {
			var
				json = {options: this.options, types: []},
				types = app.TargetableDatasetTypes;			
			
			if(this.options.isSource){
				types = app.SourceableDatasetTypes;
			}

			for(var i = 0; i < types.length; i++)
				json.types.push({value: types[i], caption: app.DatasetTypeEnum[types[i]].caption})
	
			this.$el.html(this.template(json));		
			
			if(!this.isNew)			
				this.update();
			return this;			
		},

		start: function(options){			
			$.extend(true,this.options, this.defaults, options);
			return this.render();		
		},

		// Events ------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		cancelClicked: function(ev){
			this.trigger("cancel");
		},

		saveClicked: function(ev){
			var
				server,
				self = this,
				name = $(".js-name", this.$el).val();				
				
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
					this.model.set("fieldDelimiter", $(".js-csv-field-separator", this.$el).val());
					this.model.set("recordDelimiter", $(".js-csv-line-separator", this.$el).val());
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
					this.model.set("location", $(".js-solr-core", this.$el).val());
					server.set("name", name + " - Server");
					server.set("host"    , $(".js-solr-host", this.$el).val());
					server.set("port"    , $(".js-solr-port", this.$el).val());
					server.set("ftpPort" , $(".js-solr-ftp", this.$el).val());
					server.set("username", $(".js-solr-user", this.$l).val())
					server.set("password", $(".js-solr-pass", this.$l).val())
					server.set("core", $(".js-solr-core", this.$l).val())
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
			$(".js-csv-fieldset", this.$el).show();
		},

		showSolrFieldset: function(){
			$(".js-solr-fieldset", this.$el).show()
		},

		hideFieldsets: function(){
			$(".js-fieldset", this.$el).hide();
		},	

		update: function(){
			this.datasetConector = app.DatasetTypeEnum.byPath(this.model.get("typePath"), true);
			$(".js-name",this.$el).val(this.model.get("name"));
			$('.js-conector option[value='+this.datasetConector+']', this.$el).attr('selected','selected');
			this.renderDatasetTypeFieldset();
			this.updateDatasetTypeFieldset()
		},
		updateDatasetTypeFieldset: function(){
			var
				csvLineSeparator;

			switch(this.datasetConector){
				case "csv":
					if(this.model.get("recordDelimiter")=="\r\n")
						$($('.js-csv-line-separator option', this.$el)[0]).attr('selected', 'selected')
					else
						$($('.js-csv-line-separator option', this.$el)[1]).attr('selected', 'selected')
					$(".js-csv-field-separator", this.$el).val(this.model.get("fieldDelimiter"));
				break;
				case "solr":
					$(".js-solr-host", this.$el).val(this.model.get("server").get("host"));
					$(".js-solr-core", this.$el).val(this.model.get("location"));
					$(".js-solr-port", this.$el).val(this.model.get("server").get("port"));
					$(".js-solr-ftp", this.$el).val(this.model.get("server").get("ftpPort"));
					$(".js-solr-ftp", this.$el).val(this.model.get("server").get("username"));
					$(".js-solr-ftp", this.$el).val(this.model.get("server").get("password"));
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