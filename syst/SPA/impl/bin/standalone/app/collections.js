var app = app || {};

(function () {
	'use strict';

	app.DatasetCollection = app.BaseCollection.extend({
		path: "dataset",
		model: app.DatasetModel,
		initialize: function(){
			this.on("reset", function(){
				this.models.forEach(function(mdl){mdl.nestedFetch()});				
			});
		}
	});

	app.CsvCollection = app.BaseCollection.extend({
		path: "csv",
		model: app.LogModel
	});

	app.JdbcTableCollection = app.BaseCollection.extend({
		path: "jdbctable",
		model: app.JdbcTableModel
	});

	app.JdbcDatabaseCollection = app.BaseCollection.extend({
		path: "jdbcdatabase",
		model: app.JdbcDatabaseModel
	});

	app.SolrCollection = app.BaseCollection.extend({
		path: "solrtable",
		model: app.SolrModel
	});

	app.LocalServerCollection = app.BaseCollection.extend({
		path: "localserver",
		model: app.LogModel
	});

	app.SolrServerCollection = app.BaseCollection.extend({
		path: "solrserver",
		model: app.SolrServerModel
	});

	app.LogCollection = app.BaseCollection.extend({
		path: "log",
		model: app.LogModel,
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

	app.TransactionCollection = app.BaseCollection.extend({
		path:"transaction",
		model: app.TransactionModel,
		initialize: function(){
			this.on("reset", function(){
				this.models.forEach(function(mdl){mdl.nestedFetch()});				
			});
		}
	});

	app.debug("collections.js loaded")
})();