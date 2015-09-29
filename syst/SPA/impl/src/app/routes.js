var app = app || {};
app.navigation = app.navigation || {};
app.navigation.views = {};
app.views = app.views || {}


	'use strict';
	app.navigation.showTransactionList = function(args){
		var	
			view,
			defaults= {collection: app.collections.dataset};
		args = _.extend(defaults, args);
		app.navigation.current = app.navigation.prepare("transactionList", app.TransactionListView, ["Transações", "Consulta"], "Consulta de Transações", args);    	
		view = app.navigation.current.view;	
		view.start();  
	};

	app.navigation.showNewTransaction = function(args){
		var	
			view,
			defaults= {collection: app.collections.dataset};
		args = _.extend(defaults, args);
		app.navigation.current = app.navigation.prepare("newTransaction", app.TransactionCreateUpdateView, ["Transações", "Nova"], "Nova Transaçao de Dados", args);    	
		view = app.navigation.current.view;	
		view.on("created", function(){
			app.views.validation.success("Transação criado com sucesso.");
	        app.navigation.to("Blank");
		});
		view.on("error", function(e){
	        app.views.validation.warn("Erro na criação.")
	        console.log(e);
	    });
		view.start({isSource: false});  
	};

	app.navigation.showBlank = function(args){
		$(app.placeholderId).html("");
		app.navigation.current = null;
	}

	app.navigation.showNewTarget = function(args){		

		app.navigation.current = app.navigation.prepare("newTarget", app.DatasetCreateUpdateView, ["Destinos", "Nova"], "Novo Destino", args);    	
		var view = app.navigation.current.view;		

		view.on("new", function(){
	        app.views.validation.success("Dataset de destino criado com successo.");
	        app.navigation.to("TargetsList");
	    });
	    view.on("error", function(e){
	        app.views.validation.warn("Erro na criação.")
	        console.log(e);
	    });
	    view.on("cancel", function(){
	    	app.navigation.to("TargetsList");
	    });	 

	    view.start({isSource: false});        
	};
	app.navigation.showEditTarget = function(args){
		app.navigation.current = app.navigation.prepare("editTarget", app.DatasetCreateUpdateView, ["Destinos", "Edição"], "Editar Destino", args);    	
		var view = app.navigation.current.view;
		view.on("update", function(){
	        app.views.validation.success("Dataset de destino autalizado successo.");
	        app.navigation.to("TargetList");
	    });
	     view.on("error", function(e){
	        app.views.validation.warn("Erro na criação.")
	        console.log(e);
	    });
	    view.on("cancel", function(){
	    	app.navigation.to("TargetsList");
	    })
		view.start({isSource: false}); 

	}
	app.navigation.showTargetsList = function(args){
		var			
			view,
			detailsView,
			editView,
			defaults= {collection: app.collections.dataset};
		args = _.extend(defaults, args);
		app.navigation.current = app.navigation.prepare("targetList", app.DatasetListView, ["Destinos", "Consulta"], "Consulta de Destinos", args);
		view = app.navigation.current.view;

		view.on("details", function(view){
			detailsView = new app.DatasetDetailsView({model: view.model, el:app.views.modal.$content[0]});
			detailsView.start();				
			app.views.modal.show("Destino - Detalhes");
		});
		view.on("edit", function(view){
			app.navigation.to("EditTarget", {model: view.model});
		});
		view.on("delete", function(view){
			app.views.modal.show("Destomp - Exclusão", "Dataset excluído.");
		});
		view.on("new", function(){
			app.navigation.to("NewTarget");
		});


		app.navigation.current.view.start({type:"target"});
	}


	app.navigation.showNewOrigin = function(args){
		app.navigation.current = app.navigation.prepare("newOrigin", app.DatasetCreateUpdateView, ["Origens", "Nova"], "Nova Origem", args);    	
		var view = app.navigation.current.view;		

		view.on("new", function(){
	        app.views.validation.success("Dataset de origem criado com successo.");
	        app.navigation.to("OriginsList");
	    });
	    view.on("error", function(e){
	        app.views.validation.warn("Erro na criação.")
	        console.log(e);
	    });
	    view.on("cancel", function(){
	    	app.navigation.to("OriginsList");
	    });	 

	    view.start();        
	};

	app.navigation.showEditOrigin = function(args){
		app.navigation.current = app.navigation.prepare("editOrigin", app.DatasetCreateUpdateView, ["Origens", "Edição"], "Editar Origem", args);    	
		var view = app.navigation.current.view;
		view.on("update", function(){
	        app.views.validation.success("Dataset de origem autalizado successo.");
	        app.navigation.to("OriginsList");
	    });
	     view.on("error", function(e){
	        app.views.validation.warn("Erro na criação.")
	        console.log(e);
	    });
	    view.on("cancel", function(){
	    	app.navigation.to("OriginsList");
	    })
		view.start({isSource: true}); 

	}

	app.navigation.showOriginsList = function(args){
		var			
			view,
			detailsView,
			editView,
			defaults= {collection: app.collections.dataset};
		args = _.extend(defaults, args);
		app.navigation.current = app.navigation.prepare("originList", app.DatasetListView, ["Origens", "Consulta"], "Consulta de Origens", args);
		view = app.navigation.current.view;

		view.on("details", function(view){
			detailsView = new app.DatasetDetailsView({model: view.model, el:app.views.modal.$content[0]});
			detailsView.start();				
			app.views.modal.show("Origem - Detalhes");
		});
		view.on("edit", function(view){
			app.navigation.to("EditOrigin", {model: view.model});
		});
		view.on("delete", function(view){
			app.views.modal.show("Origem - Exclusão", "Dataset excluído.");
		});
		view.on("new", function(){
			app.navigation.to("NewOrigin");
		});


		app.navigation.current.view.start({type: "source"});
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
