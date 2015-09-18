var app = app || {};
app.navigation = app.navigation || {};
app.navigation.views = {};
app.views = app.views || {}


	'use strict';

	app.navigation.showNewOrigin = function(args){
		app.navigation.current = app.navigation.prepare("newOrigin", app.NewDatasetView, ["Origens", "Nova"], "Nova Origem", args);    	
		var view = app.navigation.current.view;		

		view.on("new", function(){
	        app.views.validation.success("Dataset de origem criado com successo.");
	        app.navigation.to("OriginsList");
	    });
	    view.on("error", function(e){
	        app.views.validation.warn("Erro na criação.")
	        console.log(e);
	    });		 

	    view.start();        
	};
	app.navigation.showOriginsList = function(args){
		var
			defaults= {collection: app.collections.dataset};
		args = _.extend(defaults, args);
		app.navigation.current = app.navigation.prepare("originList", app.DatasetListView, ["Origens", "Consulta"], "Consulta de Origens", args);    	
		app.navigation.current.view.start();
	}


	app.navigation.to = function (route, args){
		var
			fn = app.navigation["show" + route],
			args = args ? args : {};

		fn(args);
	};

	app.navigation.prepare = function(name,view,breadcrumb,title,args){
		var
			defaults = {el: app.placeholderId};
		args = _.extend(defaults,args);
		app.navigation.views[name] = {};
		app.navigation.views[name].view = new view(args);
		app.views.breadcrumb.set(breadcrumb);
		app.views.title.set(title);
		return app.navigation.views[name];
	}



	













	/*app.navigation.showTransactionList = function(){		
		app.activeView.destroy;
		app.transactionView = new app.TransactionListView({collection:app.transactions});
		app.activeView = app.transactionView;
	}

	app.navigation.showStartTransaction = function(transaction){
		app.activeView.destroy;
		var log = app.logs.create({transaction: transaction.href});
		app.startTransactionView = new app.StartTransactionView({model: transaction, log: log });
		app.activeView = app.startTransactionView;
	}*/