var app = app || {};

(function () {
	'use strict';

//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//

	app.BaseModel = Backbone.Model.extend({
		nested: {},
		inherited: {},
		parse: function(a){
			try{
				this.href = a._links.self.href;
				var ss = this.href.split("/");
				this.id = ss[ss.length-1];
			}catch(e){}
			return a;
		},
		nestedFetch: function(_args){
			var args = _args || {}
			var _this = this;
			var links = args.links || this.attributes._links;
			this.dummy = {};		
	        for(var key in links)
	        {
	            if(key=='self'){
	            	this.href = links[key].href;
	            	continue;
	            }
	            var embeddedClass = this.nested[key] || this.inherited[key];
	            var embeddedLink = links[key].href;
	            if(embeddedClass)            
	            	var mdl = new embeddedClass();
	            else
	            	var mdl = new app.BaseModel();
	            if(mdl instanceof app.BaseModel)          
	           		this.set(key, mdl);
	           	else
	           		this.dummy[key] = mdl;

	           	if(args.beforeFetch)
	           		args.beforeFetch(this, mdl)
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


	app.LogModel = app.BaseModel.extend({
		nested: {
			//transaction: app.TransactionModel
		}
	});

	app.LogCollection = app.BaseCollection.extend({
		path: "log",
		model: app.LogModel
	});

	app.TransactionModel = app.BaseModel.extend({
		nested:{			
			mapping: app.MappingModel,
			targetDataset: app.DatasetModel,
			sourceDataset: app.DatasetModel,
			logs: app.LogCollection
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
			});
			//this.on("reset", function(){
			//	this.models.forEach(function(mdl){mdl.nestedFetch()});				
			//});
		}
	});




	



	console.log("models loaded");
})();