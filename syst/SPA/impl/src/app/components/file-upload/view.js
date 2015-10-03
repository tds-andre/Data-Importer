var app = app || {};
(function ($) {

	'use strict';	

	app.FileUploadView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		
		events: {
			'click  .js-file-container'  : 'containerClicked',
			'change .js-file-input'      : 'fileSelected'	
		},		
		
		defaults: {
			
		},	

		

		template: _.template($('#file-upload-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			this.options = {};
		},		

		render: function () {
			this.$el.html(this.template());			
			return this;			
		},

		start: function(options){
			$.extend(true, this.options, this.defaults, options);
			this.render();
			return this;		
		},

		// View callbacks------------------------------------------------------------------ //
		// -------------------------------------------------------------------------------- //

		containerClicked: function(ev){
			$(".js-file-input", this.$el)[0].click()
		},

		fileSelected: function(ev){
			
			var
				form = $(ev.currentTarget).parents("form")[0],
				formData = new FormData(form),
				ss =  $(ev.currentTarget).val().split("\\");
				name = ss[ss.length-1];
			if(app.isDefined(name))
				this.updateFilename(name);
			this.upload(name,formData);
				
			
		},

		// Other callbacks----------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		uploadProgress: function(event){
			var
				progress = parseInt(event.loaded/event.total * 100);
			console.log(event);
			this.setProgress(this.setProgress(progress))
			this.setProgressMessage(progress + "%")
			if(this.options.progress)
				this.options.progress(this, event);
		}
		,

		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
       
		updateFilename: function(name){
			$(".js-file-name", this.$el).val(name);
		},

		setProgressMessage: function(msg, type){
			$(".js-progress-message", this.$el).html(msg);
			if(type == "success"){
       			$(".js-progress", this.$el).removeClass("progress-bar-success")
       			$(".js-progress", this.$el).removeClass("progress-bar-danger")
       			$(".js-progress", this.$el).addClass("progress-bar-info")
       		}
			if(type == "success"){
       			$(".js-progress", this.$el).removeClass("progress-bar-info")
       			$(".js-progress", this.$el).addClass("progress-bar-success")
       		}
       		if(type == "danger"){
       			$(".js-progress", this.$el).removeClass("progress-bar-info")
       			$(".js-progress", this.$el).addClass("progress-bar-danger")
       		}
		},

       	setProgress: function(val){
       		this.progress = 0;
       		$(".js-progress", this.$el).css("width", val + "%");
       		

       	},

		upload: function(name, formData){
			var
				self = this,
				url = this.options.url;					

			self.setProgressMessage("Iniciando upload", "info");
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
        				myXhr.upload.addEventListener('progress', function(event){
        					self.uploadProgress(event)
        				}, false); 
        			}
       				return myXhr;
       			},
      
       			success:  function(data) {
       				self.setProgressMessage("Upload concluído", "success")
         			if(self.options.success)
       					self.options.success(self,data)      		
       			},
       			error: function(a,b,c){
       				if(a.readyState == 4 && a.status == 200){
       					self.setProgressMessage("Upload concluído", "success")
         				if(self.options.success)
       						self.options.success(self,data)     
       				}else{
	       				self.setProgressMessage("Erro", "danger")
	       				if(self.options.error)
	       					self.options.error(self,a,b,c)
       				}
       			},
       			complete: function(a,b,c){       				
       				if(self.options.complete)
       					self.options.complete(self,a,b,c)
       			}
			});
		

		}
	});
})(jQuery);