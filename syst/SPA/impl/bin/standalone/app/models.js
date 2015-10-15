var app = app || {};

(function () {
	'use strict';

//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//

	app.MappingModel = app.BaseModel.extend({
		defaults:{name: " - "}
	});

	app.DatasetModel = app.BaseModel.extend({
		defaults:{
			name: "Sem nome"
			

		},
		nested:{			
			server: app.ServerModel
		},
		validate: function(attrs,options){
			var result = true;
			options = this.validationBoilerplate(attrs, options);
			if(options.validate)
				return true;
			if(!this.has("name") || this.get("name") =="")
				result = false;			
			if(!this.has("server"))
				result = false;
			if(!result)
				this.trigger("invalid",this);
			console.log("invalid: ", this);
			if(!result)
				return result;
		}
	});

	app.ServerModel = app.BaseModel.extend({
		defaults:{
			name: "Sem nome",
			port: 80,
			username: "root",
			password: "rjpoc#789"
		}
	});
	app.CsvModel = app.BaseModel.extend({
		defaults:{
			name: "Sem nome",
			fieldSeparator: ";"
		},
		inherited:{
			dataset: app.DatasetModel
		}
	});

	app.JdbcTableModel = app.BaseModel.extend({
		defaults: {
		
		},
		inherited:{
			dataset: app.DatasetModel
		}
	});

	app.JdbcDatabaseModel = app.BaseModel.extend({
		defaults:{
			driver: "mysql"
		},
		inherited:{
			server: app.ServerModel
		}
	})
	
	app.SolrModel = app.BaseModel.extend({
		defaults:{name: "Sem nome"},
		inherited:{
			dataset: app.DatasetModel
		}
	});	

	app.LocalServerModel = app.BaseModel.extend({
		defaults:{name: "Sem nome"},
		inherited:{
			dataset: app.SeverModel
		}
	});

	app.SolrServerModel = app.BaseModel.extend({
		defaults:{
			name: "Sem nome",
			ftpPort: 22,
			ftpRoot: "C:/m/"
		},
		inherited:{
			dataset: app.ServerModel
		}
	});

	app.LogModel = app.BaseModel.extend({
		nested: {}
	});


	app.TransactionModel = app.BaseModel.extend({
		nested:{			
			mapping: app.MappingModel,
			targetDataset: app.DatasetModel,
			sourceDataset: app.DatasetModel,
			logs: app.LogCollection
		},

		current: function(){
			return this.get("logs").last();
		},

		validate: function(attrs,options){
			var
				result = true;
			options = this.validationBoilerplate(attrs, options);
			if(options.validate)
				result =  true;
			if(!this.has("name") || this.get("name")=="")
				result =  false;			
			if(!this.has("sourceDataset"))
				result =  false;
			if(!this.has("targetDataset"))
				result =  false;
			if(!result)
				this.trigger("invalid", this);
			console.log("invalid: ", this);
			if(!result)
				return result;

		}
	});


//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//

	app.DatasetTypeEnum = {
		"csv": { ordinal: 0, caption: "CSV", model: app.CsvModel, collection: app.CsvCollection, path: "csv"},
		"solr": { ordinal: 1, caption: "Solr", model: app.SolrModel, collection: app.SolrCollection, path: "solrtable"},
		"jdbc": { ordinal: 2, caption: "SQL", model: app.JdbcTableModel, colleciton: app.JdbcTableCollection, path: "jdbctable"},
		byPath: function(path,returnKey){
			for(var key in this)
				if(this[key].path && this[key].path==path)
					if(returnKey)
						return key;
					else
						return this[key];
			return null;
		},

	}
	app.SourceableDatasetTypes = ["csv"];
	app.TargetableDatasetTypes = ["solr", "jdbc"];

//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//

	app.debug("models.js loaded");
})();