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
			this.uploadView = null;
			this.excelUploadView = null;
			if(this.model)
				this.isNew = false;
		},		

		render: function () {
			var
				json = {options: this.options, types: []},
				types = app.TargetableDatasetTypes,
				self = this;			
			
			if(this.options.isSource){
				types = app.SourceableDatasetTypes;
			}
			var defaults =  {};
			$.extend(defaults, 				
				app.domain.Csv.prototype.defaults,
				app.domain.Solr.prototype.defaults,
				app.domain.Jdbc.prototype.defaults				
			)
			json.defaults = defaults;
			for(var i = 0; i < types.length; i++)
				json.types.push({value: types[i], caption: app.DatasetTypeEnum[types[i]].caption})
	
			this.$el.html(this.template(json));		
			
			if(this.isNew){
				this.uploadView = new app.FileUploadView({el: $(".js-csv-upload-el", this.$el)[0]});
				this.uploadView.start({flat: true, select:function(view, filename,formdata){				
					self.upload = {filename: filename, formdata: formdata}
				}});

				this.excelUploadView = new app.FileUploadView({el: $(".js-excel-upload-el", this.$el)[0]});
				this.excelUploadView.start({flat: true, select:function(view, filename,formdata){				
					self.upload = {filename: filename, formdata: formdata}
				}})
			}

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
						this.create(this.model,app.collections.csv, this.upload);
					}
					else{						
						this.patch(this.model,app.collections.csv);
					}
				break;
				case "solr":
					this.model.set("location", $(".js-solr-core", this.$el).val());					
					this.model.set("host"    , $(".js-solr-host", this.$el).val());
					this.model.set("port"    , $(".js-solr-port", this.$el).val());
					this.model.set("ftpPort" , $(".js-solr-ftp", this.$el).val());
					this.model.set("ftpRoot" , $(".js-solr-root", this.$el).val());
					this.model.set("username", $(".js-solr-user", this.$el).val())
					this.model.set("password", $(".js-solr-pass", this.$el).val())					
					if(this.isNew){						
						this.create(this.model,app.collections.solr);
					}
					else{						
						this.patch(this.model,app.collections.solr);
					}					
				break;
				case "jdbc":
					this.model.set("location", $(".js-jdbc-table"   , this.$el).val());					
					this.model.set("driver"  , $(".js-jdbc-driver"  , this.$el).val());
					this.model.set("db"      , $(".js-jdbc-database", this.$el).val());
					this.model.set("username", $(".js-jdbc-user"    , this.$el).val());
					this.model.set("password", $(".js-jdbc-pass"    , this.$el).val());
					this.model.set("host"    , $(".js-jdbc-host"    , this.$el).val());
					if(this.isNew){						
						this.create(this.model,app.collections.jdbc);
					}
					else{						
						this.patch(this.model,app.collections.jdbc);
					}
				break;
				case "excel":
					this.model.set("sheet", $(".js-excel-sheet"   , this.$el).val());					
					if(this.isNew){						
						this.create(this.model,app.collections.excel, this.upload);
					}
					else{						
						this.patch(this.model,app.collections.excel);
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
				case "excel":
					this.showExcelFieldset();
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
		showExcelFieldset: function(){
			$(".js-excel-fieldset", this.$el).show()
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
					var index = 0
					if(this.model.get("recordDelimiter")=="\n") index = 1;
					$($('.js-csv-line-separator option', this.$el)[index]).attr('selected', 'selected')					
					$(".js-csv-field-separator", this.$el).val(this.model.get("fieldDelimiter"));
				break;
				case "solr":
					$(".js-solr-host", this.$el).val(this.model.get("host"    ));
					$(".js-solr-core", this.$el).val(this.model.get("location"));
					$(".js-solr-port", this.$el).val(this.model.get("port"    ));
					$(".js-solr-ftp" , this.$el).val(this.model.get("ftpPort" ));
					$(".js-solr-user", this.$el).val(this.model.get("username"));
					$(".js-solr-pass", this.$el).val(this.model.get("password"));
					$(".js-solr-root", this.$el).val(this.model.get("ftpRoot" ));
				break;
				case "jdbc":
					$(".js-jdbc-driver"  , this.$el).val(this.model.get("driver"   ));
					$(".js-jdbc-table"   , this.$el).val(this.model.get("location" ));
					$(".js-jdbc-database", this.$el).val(this.model.get("db"       ));
					$(".js-jdbc-user"    , this.$el).val(this.model.get("username" ));
					$(".js-jdbc-pass"    , this.$el).val(this.model.get("passoword"));
					$(".js-jdbc-host"    , this.$el).val(this.model.get("host"));
				break;
				case "excel":
					$(".js-excel-sheet"  , this.$el).val(this.model.get("sheet"   ));
				break;
			}
			

		},

		create: function(dataset,datasetCollection,upload){
			var				
				self = this,
				upload = upload || false;
			dataset.on("invalid", function(){self.trigger("error", self)});			
			datasetCollection.persist(dataset, 
				{
					success: function(ee){
						if(upload){
							self.uploadView.options.success = function(){
								self.trigger("new", self);								
							};
							self.uploadView.options.url = datasetCollection.uploadUrl(self.model);
							self.uploadView.upload(self.upload.filename,self.upload.formdata);
							
						}else
							self.trigger("new",self)
					}, 
					error: function(ee){
						self.trigger("error", self)
					}
				}
			);					
		},
		patch: function(dataset,datasetCollection){
			var
				self = this;			
			dataset.on("invalid", function(){self.trigger("error", self)});			
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
		}





	});
})(jQuery);