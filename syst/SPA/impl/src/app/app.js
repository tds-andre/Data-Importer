var app = app || {};
$(function () {
    'use strict';
    //core 
    app.navigation = {};
    app.views = {};
    app.placeholderId = "#main-content-placeholder";
    app.$placeholder = $(app.placeholderId);
    app.$title = $("#main-content-title");
    app.activeView = {destroy: function(){}};

    //compact view for the breadcrumb
    app.views.breadcrumb = {
    	$el: $("#main-breadcrumb"),
    	set: function(strings){
    		var
    			i = 0,
    			$last = null,
    			proto = $el.find(":first-child").html();

    		$el.html(proto);
    		for(i = 0; i < strings.length; i++){
    			$el.append("<li>"+strings[i]+"</li>")
    		}
    		$el.find("li:last-of-type").addClass("active");
    		app.$title.html($el.find("li:last-of-type").html());
    	}
    };

    //compact view for the menu
    app.views.menu = {
    	init: function(){
    		$("#new-origin-button").on("click", function(event){
    			app.navigation.to("NewOrigin");
    			console.log(event);
    		});
    	}
    };
    app.views.menu.init();
    
    //utils
    app.sleep = function(millis)
	 {
	  var date = new Date();
	  var curDate = null;
	  do { curDate = new Date(); }
	  while(curDate-date < millis);
	}


	//navigation
	app.navigation.views = {};
	app.navigation.showTransactionList = function(){		
		app.activeView.destroy;
		app.transactionView = new app.TransactionListView({collection:app.transactions});
		app.activeView = app.transactionView;
	}

	app.navigation.showStartTransaction = function(transaction){
		app.activeView.destroy;
		var log = app.logs.create({transaction: transaction.href});
		app.startTransactionView = new app.StartTransactionView({model: transaction, log: log });
		app.activeView = app.startTransactionView;
	}
	app.navigation.showNewOrigin = function(args){
		app.navigation.views.newOrigin = {};
		app.navigation.views.newOrigin.view = new app.NewDatasetView({el: app.placeholderId});
        app.navigation.views.newOrigin.view.start();
	};
	app.navigation.to = function (route, args){
		var
			fn = app.navigation["show" + route],
			args = args ? args : {};
		fn(args);
	}
	

	//initialization
    /*app.transactions = new app.TransactionCollection({elEctor:"#transaction-list-placeholder"});
    app.logs = new app.LogCollection();
    app.showTransactionList();
    app.transactionView.on("selected", function(transaction){
    	app.showStartTransaction(transaction);
    })*/



    console.log("data-importer app loaded");
});


