var app = app || {};

(function () {
	'use strict';

//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//

	app.BaseModel = Backbone.Model.extend({
		nested: {},
		inherited: {},
		destroy: function(args){
			for(var key in this.inherited){

			}
			args = args || {};
			$.ajax({
 				url: this.href, 
 				type: "DELETE", 
 				contentType: "application/json", 				
 				success: function(data,status,xhr){ 					
 					if(args.success)
 						args.success(data, status, xhr);
 					console.log("BaseModel, destroy success:", data,status,xhr);
 				},
 				error: function(request,status,error){
 					if(args.error)
 						args.error(request,status,error);
 					console.log("BaseModel, destroy error:", request,status,error);
 				},
 				complete: function(a,b,c){
 					if(args.complete)
 						args.complete(a,b,c); 					
 				}
 			});

		},
		setIdentity: function(url){
			var
				ss = url.split("/");
			this.href = url;
			this.id = ss[ss.length-1];

		},
		parse: function(a){
			console.log("model parse: ", a);
			this.setIdentity(a._links.self.href);			
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
	           		this.set(key,mdl);

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
 			
 			var 
 				arrays = response._embedded,
 				result = [],
 				i = 0,
 				key;
 			for(key in arrays){
 				for(i = 0; i < arrays[key].length; i++){
 					arrays[key][i].typePath = key;
 					result.push(arrays[key][i]);
 				}
 			} 			
 			console.log("BaseCollection.parse, response:", response);
 			console.log("BaseCollection.parse, result:", result);
 			return result;
 		},
 		persist: function(model,args){
 			args = args ? args : {};
 			$.ajax({
 				url: this.url(), 
 				type: "POST", 
 				contentType: "application/json", 
 				data: JSON.stringify(model.toJSON()),  
 				success: function(data,status,xhr){
 					model.setIdentity(xhr.getResponseHeader("Location"));
 					if(args.success)
 						args.success(data, status, xhr);
 					console.log(data,status,xhr);
 				},
 				error: function(request,status,error){
 					if(args.error)
 						args.error(request,status,error);
 				},
 				complete: function(a,b,c){
 					if(args.complete)
 						args.complete(a,b,c);
 					console.log(a,b,c);
 				}
 			});
 		},
 		update: function(model, args){
 			args = args ? args : {};
 			$.ajax({
 				url: this.url() + "/" + model.id, 
 				type: "PATCH", 
 				contentType: "application/json", 
 				data: JSON.stringify(model.toJSON()),  
 				success: function(data,status,xhr){ 					
 					if(args.success)
 						args.success(data, status, xhr);
 					console.log(data,status,xhr);
 				},
 				error: function(request,status,error){
 					if(args.error)
 						args.error(request,status,error);
 				},
 				complete: function(a,b,c){
 					if(args.complete)
 						args.complete(a,b,c);
 					console.log(a,b,c);
 				}
 			});
 		}
 			
 		
	});
 		

//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//

	app.MappingModel = app.BaseModel.extend({defaults:{name: "Sem nome"}});
	app.DatasetModel = app.BaseModel.extend({
		defaults:{name: "Sem nome"},
		nested:{			
			server: app.ServerModel
		}


	});
	app.DatasetCollection = app.BaseCollection.extend({
		path: "dataset",
		model: app.DatasetModel,
		initialize: function(){
			this.on("reset", function(){
				this.models.forEach(function(mdl){mdl.nestedFetch()});				
			});
		}
	});
	app.ServerModel = app.BaseModel.extend({defaults:{name: "Sem nome"}});
	app.CsvModel = app.BaseModel.extend({
		defaults:{name: "Sem nome"},
		inherited:{
			dataset: app.DatasetModel
		}
	});
	app.CsvCollection = app.BaseCollection.extend({
		path: "csv",
		model: app.LogModel
	});

	app.SolrModel = app.BaseModel.extend({
		defaults:{name: "Sem nome"},
		inherited:{
			dataset: app.DatasetModel
		}
	});
	app.SolrCollection = app.BaseCollection.extend({
		path: "solrtable",
		model: app.SolrModel
	});

	app.LocalServerModel = app.BaseModel.extend({
		defaults:{name: "Sem nome"},
		inherited:{
			dataset: app.SeverModel
		}
	});
	app.LocalServerCollection = app.BaseCollection.extend({
		path: "localserver",
		model: app.LogModel
	});


	app.SolrServerModel = app.BaseModel.extend({
		defaults:{name: "Sem nome"},
		inherited:{
			dataset: app.ServerModel
		}
	});
	app.SolrServerCollection = app.BaseCollection.extend({
		path: "solrserver",
		model: app.SolrServerModel
	})


	app.LogModel = app.BaseModel.extend({
		nested: {
			//transaction: app.TransactionModel
		},
		upload: function(formData, options){
			var
				url = app.LogCollection.prototype.url() + "/" + this.id + "/upload",
				defaults = {},
				settings = $.extend(options,defaults);

			$.ajax({
       			url: url,  
       			type: 'POST',
       			data: formData,
		     	cache: false,
		        contentType: false,
		        processData: false,
       			xhr: function() { 
        			var
        				myXhr = $.ajaxSettings.xhr();
        			if(myXhr.upload){
        				if(settings.progress)
         					myXhr.upload.addEventListener('progress', settings.progress, false); 
        			}
       				return myXhr;
       			},
      
       			success:  function(data) {       				
         			if(settings.success)
       					settings.success(data)      		
       			},
       			error: function(a,b,c){
       				if(settings.error)
       					settings.error(a,b,c)
       			},
       			complete: function(a,b,c){
       				if(settings.complete)
       					settings.complete(a,b,c)
       			}
			});
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
		},

		lastLog: function(){
			return this.get("logs").last();
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

//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//

	app.DatasetTypeEnum = {
		"csv": { ordinal: 0, caption: "CSV", model: app.CsvModel, collection: app.CsvCollection, path: "csv"},
		"solr": { ordinal: 0, caption: "Solr", model: app.SolrModel, collection: app.SolrCollection, path: "solrtable"},
		byPath: function(path,returnKey){
			for(var key in this)
				if(this[key].path && this[key].path==path)
					if(returnKey)
						return key;
					else
						return this[key];
			return null;
		}
	}
	app.SourceableDatasetTypes = ["csv"];
	app.TargetableDatasetTypes = ["solr"];

//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//
//------------------------------------------------------------------------------//


	



	console.log("models loaded");
})();