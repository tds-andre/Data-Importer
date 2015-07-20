var app = app || {};

(function () {
	'use strict';

//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//

	app.BaseModel = Backbone.Model.extend({
		nested: {},
		inherited: {},
		nestedFetch: function(_links){
			var _this = this;
			var links = _links || this.attributes._links;			
	        for(var key in links)
	        {
	            if(key=='self')
	            	continue;
	            var embeddedClass = this.nested[key] || this.inherited[key];
	            var embeddedLink = links[key].href;
	            if(embeddedClass)            
	            	var mdl = new embeddedClass();
	            else
	            	var mdl = new app.BaseModel();	            
	           	this.set(key, mdl);
	            mdl.fetch({url: embeddedLink});
	          	
	        }
	        this.trigger("innersync");
    	}
	});

	app.BaseCollection = Backbone.Collection.extend({
		url: function() {
 		   return app.config.serverUrl + '/' + this.path;
 		},
 		parse: function(response){
 			return response._embedded[this.path];
 		}
	});

//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//

	app.MappingModel = app.BaseModel.extend({defaults:{name: "Sem nome"}});
	app.DatasetModel = app.BaseModel.extend({defaults:{name: "Sem nome"}});
	app.ServerModel = app.BaseModel.extend({defaults:{name: "Sem nome"}});
	app.CsvModel = app.BaseModel.extend({
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

	app.TransactionModel = app.BaseModel.extend({
		nested:{			
			mapping: app.MappingModel,
			targetDataset: app.DatasetModel,
			sourceDataset: app.DatasetModel
		},
		defaults:{
			mapping : "Indefinido"
		}
	});

	app.TransactionCollection = app.BaseCollection.extend({
		path:"transaction",
		model: app.TransactionModel,
		initialize: function(){
			this.on("sync", function(){
				this.models.forEach(function(mdl){mdl.nestedFetch()});				
			})
			this.on("reset", function(){
				this.models.forEach(function(mdl){mdl.nestedFetch()});				
			})
		}
	});


	



	console.log("models loaded");
})();