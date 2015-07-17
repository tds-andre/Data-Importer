var app = app || {};

(function () {
	'use strict';
	app.superJson = 
	app.BaseModel = Backbone.Model.extend({
		nesteds: {},

		nestedFetch: function(_links){
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
            mdl.fetch({url: embeddedLink});
          	this.set(key, mdl);
        }

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

	app.ScdModel = app.BaseModel.extend({defaults:{name: "Sem nome"}});

	app.TransactionModel = app.BaseModel.extend({
		nested:{			
			mapping: app.ScdModel,
			targetDataset: app.ScdModel,
			sourceDataset: app.ScdModel
		},
		inherited:{
			scd: app.ScdModel
		}
	});

	app.TransactionCollection = app.BaseCollection.extend({
		path:"transaction",
		model: app.TransactionModel,
		initialize: function(){
			this.on("sync", function(){
				this.models.forEach(function(mdl){mdl.nestedFetch()})
				this.trigger("fullsync");
			})
		}
	});


	



	console.log("models loaded");
})();