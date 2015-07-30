var app = app || {};

(function ($) {

	'use strict';	

	app.StartTransactionView = Backbone.View.extend({

		el: '#transaction-list-placeholder',

		events: {
			'change .js-file': 'upload'
		},

		template: _.template($('#start-transaction-template').html()),

		progress: 0,
		uploading: false,
		uploaded: false,

		initialize: function () {
			var self = this;
			this.model.get("targetDataset").nestedFetch({beforeFetch: function(){
				self.listenTo(self.model.get('targetDataset'), 'change', self.updateTargetDataset);			
				self.listenTo(self.model.get('targetDataset'), 'sync', self.updateTargetDataset);
				self.listenTo(self.model.get('targetDataset').get("server"), 'change', self.updateSourceServer);
				self.listenTo(self.model.get('targetDataset').get("server"), 'sync', self.updateTargetServer);
			}});
			this.model.get("sourceDataset").nestedFetch({beforeFetch: function(){
				self.listenTo(self.model.get('sourceDataset'), 'change', self.updateSourceDataset);
				self.listenTo(self.model.get('sourceDataset'), 'sync', self.updateSourceDataset);
			}});
			this.render();			
			this.listenTo(this.model, "change:name", this.updateName);
		},

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this;			
		},		

		upload: function(e){
			var 
				xhr = new XMLHttpRequest(),
				self = this,
				file = e.currentTarget.files[0];
				
			xhr.upload.addEventListener(
				"progress", 
				function(e) {	
					self.addProgress(parseInt(100 - (e.loaded / e.total * 100)));
				}, 
				false
			);

			xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4) 
					xhr.status == 200 ? self.setFile(file.name) : self.unsetFile;				
			};

			xhr.open("POST", app.config.serverUrl + "/upload", true);
			//xhr.setRequestHeader("X-FILENAME", file.name);
			xhr.send(file);
		},

		setFile: function(filename){			
			this.model.save({uploadedFilename: filename}, {
				success: function(){
					this.uploading = false;
					this.uploaded = true;
					this.progress = 100;
					updateUploadMessage("Arquivo carregado");			
					updateProgress(100);
				}
			});
		},

		unsetFile: function(){
			this.uploading = false;
			this.uploaded = false;
			this.progress = 0;
			updateProgress(0);
			updateUploadMessage("Sem arquivo");
		},

		addProgress: function(val){
			this.progress += val;
			this.updateProgress(this.progress);
			this.updateUploadMessage("Carregand arquivo ("+this.progress+"%)");
			
		}, 

		updateProgress: function(val){
			$(".js-progress", this.$el).css("width", val + "%");
		},

		updateUploadMessage: function(msg){
			$(".js-upload-message", this.$el).html(msg);
		},

		updateName: function(){
			$(".js-name", this.$el).html(this.model.get("name"));
			$(".js-file", this.$el).prop("name",this.model.get("id"));
		},

		updateSourceDataset: function(dataset){
			$(".js-sourceDataset-name", this.$el).html(dataset.get("name"));
			this.updateSourceServer(dataset.get("server"));
		},

		updateTargetDataset: function(dataset){
			$(".js-targetDataset-name", this.$el).html(dataset.get("name"));
			this.updateTargetServer(dataset.get("server"));
			
		}, 
		udateTargetServer: function(sever){
			$(".js-targetDataset-server-host", this.$el).html(server.get("host"));
			$(".js-targetDataset-server-port", this.$el).html(server.get("port"));
		},
		updateSourceServer: function(server){
			
		}
		


		

		

	});

	console.log("start transaction view loaded");
})(jQuery);

