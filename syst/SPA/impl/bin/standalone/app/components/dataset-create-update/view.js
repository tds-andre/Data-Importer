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
			var defaults =  {};
			$.extend(defaults, 				
				(new app.CsvModel()).defaults, 
				(new app.SolrServerModel()).defaults,
				(new app.ServerModel()).defaults,
				(new app.JdbcDatabaseModel().defaults)
			)
			json.defaults = defaults;
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
						this.patch(this.model,server,app.collections.csv,app.collections.localServer);
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
					server.set("ftpRoot" , $(".js-solr-root", this.$el).val());
					server.set("username", $(".js-solr-user", this.$el).val())
					server.set("password", $(".js-solr-pass", this.$el).val())
					server.set("core", $(".js-solr-core", this.$l).val())
					if(this.isNew){						
						this.create(this.model,server,app.collections.solr,app.collections.solrServer);
					}
					else{						
						this.patch(this.model,server,app.collections.solr,app.collections.solrServer);
					}					
				break;
				case "jdbc":
					if(this.isNew)
						server = new app.LocalServerModel();
					else
						server = this.model.get("server");
					this.model.set("location", $(".js-jdbc-table", this.$el).val());
					this.model.set("recordDelimiter", $(".js-csv-line-separator", this.$el).val());
					server.set("name", name + " - Server");
					server.set("driver", $(".js-jdbc-driver", this.$el).val());
					server.set("db", $(".js-jdbc-database", this.$el).val());
					if(this.isNew){						
						this.create(this.model,server,app.collections.jdbcTable,app.collections.jdbcDatabase);
					}
					else{						
						this.patch(this.model,server,app.collections.jdbcTable,app.collections.jdbcDatabase);
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
				case "jdbc":
					this.showJdbcFieldset();
				break;
			}
			

		},

		showJdbcFieldset: function(){
			$(".js-jdbc-fieldset", this.$el).show();
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
					if(this.model.get("recordDelimiter")=="\n")
						$($('.js-csv-line-separator option', this.$el)[1]).attr('selected', 'selected')
					else
						$($('.js-csv-line-separator option', this.$el)[0]).attr('selected', 'selected')
					$(".js-csv-field-separator", this.$el).val(this.model.get("fieldDelimiter"));
				break;
				case "solr":
					$(".js-solr-host", this.$el).val(this.model.get("server").get("host"));
					$(".js-solr-core", this.$el).val(this.model.get("location"));
					$(".js-solr-port", this.$el).val(this.model.get("server").get("port"));
					$(".js-solr-ftp", this.$el).val(this.model.get("server").get("ftpPort"));
					$(".js-solr-user", this.$el).val(this.model.get("server").get("username"));
					$(".js-solr-pass", this.$el).val(this.model.get("server").get("password"));
					$(".js-solr-root", this.$el).val(this.model.get("server").get("ftpRoot"));
				break;
				case "jdbc":
					$(".js-jdbc-driver", this.$el).val(this.model.get("server").get("driver"));
					$(".js-jdbc-table", this.$el).val(this.model.get("location"));
					(".js-jdbc-database", this.$el).val(this.model.get("db"));
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
		patch: function(dataset,server,datasetCollection,serverCollection){
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
									self.trigger("update", self);
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