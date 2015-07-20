var app = app || {};
$(function () {
    'use strict';

    app.sleep = function(millis)
	 {
	  var date = new Date();
	  var curDate = null;
	  do { curDate = new Date(); }
	  while(curDate-date < millis);
	}


	app.showTransactionList = function(){		
		app.activeView.destroy;
		app.transactionView = new app.TransactionListView({collection:app.transactions});
		app.activeView = app.transactionView;
	}

	app.showStartTransaction = function(transaction){
		app.activeView.destroy;		
		app.startTransactionView = new app.StartTransactionView({model: transaction});
		app.activeView = app.startTransactionView;
	}
	app.activeView = {destroy: function(){}};
    app.transactions = new app.TransactionCollection({elEctor:"#transaction-list-placeholder"});
    app.showTransactionList();
    app.transactionView.on("selected", function(transaction){
    	app.showStartTransaction(transaction);
    })
    console.log("app loaded");


	
	

});


