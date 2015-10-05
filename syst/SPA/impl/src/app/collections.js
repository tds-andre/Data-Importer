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
		model: app.LogModel
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

	console.log("collections.js loaded")
})();