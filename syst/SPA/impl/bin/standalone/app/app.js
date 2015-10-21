var app = app || {};
app.navigation = app.navigation || {};
app.views = app.views || {};
$(function () {
    'use strict';

    //core
    app.placeholderId = "#main-content-placeholder";   
    app.$placeholder = $(app.placeholderId);          //MARCAÇÃO : .header-title
    app.$title = $("#main-content-title");            //MARCAÇÃO : <!-- Page Body --> >>>> class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
    app.$validation = $("#validation-modal");         //MARCAÇÃO : Fica no arquivo app.php
    app.$modal = $("#generic-modal");                 //MARCAÇÃO : Fica no arquivo app.php
    app.$breadcrumb = $("#main-breadcrumb");          //MARCAÇÃO : Em cima do titulo
        
    //marcações
    // #new-origin-button :  menu >>>>> <!-- origens -->
    // #list-origins-button : menu >>>>> <!-- origens -->    

    //compact view for generic modal
    app.views.modal = {
        $el: app.$modal,
        $content: null,
        $title: null,
        show: function(title, html){
            if(html)
                this.$content.html(html);
            if(title)
                this.$title.html(title);
            this.$el.modal("show");           
        },
        init: function(){
            this.$content = this.$el.find(".modal-body");
            this.$title = this.$el.find(".modal-title");
        }
    }
    app.views.modal.init();

    //compact view for modal with success and error alerts
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

    //compact view for the breadcrumb 
    app.views.breadcrumb = {
    	$el: app.$breadcrumb,
    	set: function(strings){
    		var
    			i = 0,
    			$last = null,
    			proto = this.$el.find("li:first-child").clone();

    		this.$el.html("").append(proto);
    		for(i = 0; i < strings.length; i++){
    			this.$el.append("<li>"+strings[i]+"</li>")
    		}
    		this.$el.find("li:last-of-type").addClass("active");
    		
    	}
    };

    //compact view for the title 
    app.views.title = {
        $el: app.$title,
        set: function(title){
            this.$el.html(title);
        }
    }

    //compact view for the side menu
    app.views.menu = {
        $activable: $(".js-activable"),
        toogle: function(id){
            this.$activable.removeClass("active");
            $(id).addClass("active");
        },
    	init: function(){
            var self = this;
    		$("#new-origin-button").on("click", function(event){
    			app.navigation.to("NewOrigin");
                self.toogle("#new-origin-button")
    		});
            $("#origins-list-button").on("click", function(event){
                app.navigation.to("OriginsList");
                self.toogle("#origins-list-button")
            });
            $("#new-target-button").on("click", function(event){
                app.navigation.to("NewTarget");
                self.toogle("#new-target-button")
            });
            $("#target-list-button").on("click", function(event){
                app.navigation.to("TargetsList");
                self.toogle("#target-list-button")
            });
            $("#new-transaction-button").on("click", function(event){
                app.navigation.to("NewTransaction");
                self.toogle("#new-transaction-button")
            });
            $("#transaction-list-button").on("click", function(event){
                app.navigation.to("TransactionList");
                self.toogle("#transaction-list-button")
            });
            $("#transaction-report-button").on("click", function(event){
                app.navigation.to("TransactionReport");
                self.toogle("#transaction-report-button")
            });
    	}
    };
    app.views.menu.init();
    
    //global utilitary functions
    app.sleep = function(millis)
	 {
	  var date = new Date();
	  var curDate = null;
	  do { curDate = new Date(); }
	  while(curDate-date < millis);
	}
    app.isDefined = function(obj){
        if(typeof obj =='undefined' || obj==null || obj=="undefined" || obj == "")
            return false;
        return true;
    }
    app.log = function(a){
        console.log(a)
    },    


    //global collections
    app.collections = {        
        csv: new app.domain.CsvCollection(),
        dataset: new app.domain.DatasetCollection(),
        solr: new app.domain.SolrCollection(),        
        transaction: new app.domain.TransactionCollection(),
        log: new app.domain.LogCollection(),
        jdbc: new app.domain.JdbcCollection(),
        excel: new app.domain.ExcelCollection()
    };

	
    //starter page trigger
    $("#transaction-report-button").click();

    //app loaded
    app.log("data-importer app loaded");
});


