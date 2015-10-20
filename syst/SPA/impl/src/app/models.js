var app = app || {};
app.domain = app.domain || {};

(function () {
	'use strict';

//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//	

	app.domain.Field = app.BaseModel.extend({
		defaults:{			
		}
	});


	app.domain.FieldCollection = app.BaseCollection.extend({
		path: "field",
		model: app.domain.Field,
	});


	app.domain.Dataset = app.BaseModel.extend({
		defaults:{		
		},
		nested:{
			fields: app.domain.FieldCollection
		}
	});

	app.domain.Upload = app.domain.Dataset.extend({
		defaults:{			
		}
	});

	app.domain.Excel = app.domain.Upload.extend({
		defaults:{			
		}
	});

	app.domain.Csv = app.domain.Upload.extend({
		defaults:{			
			fieldSeparator: ";"
		}
	});

	app.domain.Jdbc = app.domain.Upload.extend({
		defaults:{
			driver: "mysql",
			host: "127.0.0.1"	
		}
	});

	app.domain.Solr = app.domain.Dataset.extend({
		defaults:{
			username: "root",
			password: "rjpoc#789",
			ftpRoot: "c:/m/",
			ftpPort: 22,
			port: 8080
		}
	});	

	app.domain.Log = app.BaseModel.extend({
		defaults:{
		},
		nested: {
		}
	});

	app.domain.Transaction = app.BaseModel.extend({
		nested:{			
			targetDataset: app.domain.Dataset,
			sourceDataset: app.domain.Dataset,
			logs: app.domain.LogCollection
		},
		current: function(){
			return this.get("logs").last();
		}
	});

//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//

	app.domain.DatasetCollection = app.BaseCollection.extend({
		path: "dataset",
		model: app.domain.Dataset,
	});

	

	app.domain.UploadCollection = app.BaseCollection.extend({
		path: "upload",
		model: app.domain.Upload,
		uploadUrl: function(model){
			return app.config.serverUrl +"/"+this.path+"/" + model.idd + '/upload';
		}
	});

	app.domain.CsvCollection = app.domain.UploadCollection.extend({
		path: "csv",
		model: app.domain.Csv
	});

	app.domain.ExcelCollection = app.domain.UploadCollection.extend({
		path: "excel",
		model: app.domain.Excel
	});

	app.domain.JdbcCollection = app.BaseCollection.extend({
		path: "jdbctable",
		model: app.domain.Jdbc
	});

	app.domain.SolrCollection = app.BaseCollection.extend({
		path: "solrtable",
		model:	app.domain.Solr
	});

	app.domain.TransactionCollection = app.BaseCollection.extend({
		path:"transaction",
		model:	app.domain.Transaction		
	});

	app.domain.LogCollection = app.BaseCollection.extend({
		path: "log",
		model: app.domain.Log,
		do: function(log, options){
			var 
				self =this;
			options = options || {};
			$.ajax({
				url: app.config.serverUrl +"/"+this.path+"/" + log.idd + '/do',
				type: "GET",
				success: function(){
					if(options.success)
						options.success(log);

				},
				error: function(){
					if(options.error)
						options.error(log);
				}
			})
		}
	});	

//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//

	app.DatasetTypeEnum = {
		"csv": { ordinal: 0, caption: "CSV", model: app.domain.Csv, collection: app.domain.CsvCollection, path: "csv"},
		"excel": { ordinal: 0, caption: "Excel", model: app.domain.Excel, collection: app.domain.ExcelCollection, path: "excel"},
		"solr": { ordinal: 1, caption: "Solr", model: app.domain.Solr, collection: app.domain.SolrCollection, path: "solrtable"},
		"jdbc": { ordinal: 2, caption: "SQL", model: app.domain.Jdbc, colleciton: app.domain.JdbcCollection, path: "jdbctable"},
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
	
	app.SourceableDatasetTypes = ["csv", "excel"];
	app.TargetableDatasetTypes = ["solr", "jdbc"];

//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//

	app.debug("models.js loaded");
})();