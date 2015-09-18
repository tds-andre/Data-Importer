var app = app || {};
$(function () {
    'use strict';
    //core 
    app.navigation = {};
    app.views = {};
    app.placeholderId = "#main-content-placeholder";
    app.$placeholder = $(app.placeholderId);
    app.$title = $("#main-content-title");
    app.$validation = $("#validation-modal");
    app.activeView = {destroy: function(){}};

    //compact view for the breadcrumb
    app.views.validation = {
        $el: app.$validation ,
        $body: null,
        $title: null,
        $button: null,
        $icon: null,
        warn: function(msg){
            this.$el.removeClass("modal-success");
            this.$el.addClass("modal-warning");
            this.$icon.removeClass("glyphicon-check");
            this.$icon.removeClass("glyphicon");
            this.$icon.addClass("fa");
            this.$icon.addClass("fa-warning");   
            this.$body.html(msg);
            this.$el.modal("show");
            this.$title.html("Atenção");
            this.$button.removeClass("btn-success");
            this.$button.addClass("btn-warning")
        },

        success: function(msg){      
            this.$el.removeClass("modal-warning");
            this.$el.addClass("modal-success");
            this.$icon.removeClass("fa-warning");
            this.$icon.removeClass("fa");
            this.$icon.addClass("glyphicon-check");
            this.$icon.addClass("glyphicon");            
            this.$body.html(msg);
            this.$title.html("Sucesso")
            this.$el.modal("show");
            this.$button.removeClass("btn-warning");
            this.$button.addClass("btn-success")
        },
        init: function(){
            this.$body = this.$el.find(".modal-body");
            this.$title = this.$el.find(".modal-title");
            this.$button = this.$el.find(".btn");
            this.$icon = this.$el.find(".fa");
        }
    },
    app.views.validation.init();

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
    app.isDefined(obj){
        if(obj==null || obj=="undefined" || obj == "")
            return false;
        return true;
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
        var 
            view = null;
		app.navigation.views.newOrigin = {};
        view = new app.NewDatasetView({el: app.placeholderId});
		app.navigation.views.newOrigin.view = view;
        view.on("new", function(){
            app.views.validation.warn("Dataset de origem criado com successo");
            //app.navigation.to("OriginList");
        });
        view.on("error", function(e){
            app.views.validation.warn("Erro na criação.")
            console.log(e);
        });
        view.start();

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


