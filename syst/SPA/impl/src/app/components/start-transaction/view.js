var app = app || {};

(function ($) {

	'use strict';	

	app.StartTransactionView = Backbone.View.extend({

		el: '#transaction-list-placeholder',

		events: {
			'change .js-file'  : 'upload',
			'click  .actions'  : 'stepClick'
			

		},

		template: _.template($('#start-transaction-template').html()),

		progress: 0,
		uploading: false,
		uploaded: false,
		step: 1,

		stepClick: function(ev){
			console.log(ev);
			if($(ev.target).hasClass("btn-next")){
				this.changeStep(this.step + 1);
			} else if($(ev.target).hasClass("btn-prev")){
				this.changeStep(this.step - 1);

			}	

		},		

		
		changeStep: function(value){
			this.step = value;
			switch(this.step){
				case 1:
					$(".btn-next",this.$el).removeAttr("disabled");
					break;
				case 2:
					if(!this.uploaded)
						$(".btn-next",this.$el).attr("disabled", true);
					break;
				default:
			}
		},


		initialize: function () {
			$('input[type="file"]').ajaxfileupload({
				'action': '/upload/' +this.model.dummy.logs.models[this.model.dummy.logs.models.length-1].id,
				'params': {
				'extra': 'info'
				},
				'onComplete': function(response) {
				console.log('custom handler for file:');
					alert(JSON.stringify(response));
				},
				'onStart': function() {
					if(weWantedTo) return false; // cancels upload
				},
				'onCancel': function() {
					console.log('no file selected');
				}
		    });

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
			//this.on("change:step", this.changeStep);
		},

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this;			
		},		




		upload: function(e){
			function fileUpload(form, action_url, div_id) {
				

			    // Create the iframe...
			    var iframe = document.createElement("iframe");
			    iframe.setAttribute("id", "upload_iframe");
			    iframe.setAttribute("name", "upload_iframe");
			    iframe.setAttribute("width", "0");
			    iframe.setAttribute("height", "0");
			    iframe.setAttribute("border", "0");
			    iframe.setAttribute("style", "width: 0; height: 0; border: none;");
			 
			    // Add to document...
			    form.parentNode.appendChild(iframe);
			    window.frames['upload_iframe'].name = "upload_iframe";
			 
			    var iframeId = $("#upload_iframe")[0];
			 
			    // Add event...
			    var eventHandler = function () {
			 
			            if (iframeId.detachEvent) iframeId.detachEvent("onload", eventHandler);
			            else iframeId.removeEventListener("load", eventHandler, false);
			 
			            // Message from server...
			            if (iframeId.contentDocument) {
			                content = iframeId.contentDocument.body.innerHTML;
			            } else if (iframeId.contentWindow) {
			                content = iframeId.contentWindow.document.body.innerHTML;
			            } else if (iframeId.document) {
			                content = iframeId.document.body.innerHTML;
			            }
			 
			            document.getElementById(div_id).innerHTML = content;
			 
			            // Del the iframe...
			            setTimeout('iframeId.parentNode.removeChild(iframeId)', 250);
			        }
			 
			    if (iframeId.addEventListener) iframeId.addEventListener("load", eventHandler, true);
			    if (iframeId.attachEvent) iframeId.attachEvent("onload", eventHandler);
			 
			    // Set properties of form...
			    form.setAttribute("target", "upload_iframe");
			    form.setAttribute("action", action_url);
			    form.setAttribute("method", "post");
			    form.setAttribute("enctype", "multipart/form-data");
			    form.setAttribute("encoding", "multipart/form-data");
			 
			    // Submit the form...
			    form.submit();
			 
			    document.getElementById(div_id).innerHTML = "Uploading...";
			}

			var
				form = $(e.currentTarget).parent()[0],
				action_url = "/upload/" + this.model.dummy.logs.models[this.model.dummy.logs.models.length-1].id,
				div_id = "blah";
			fileUpload(form, action_url, div_id);

			/*var 
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

			xhr.open("POST", app.config.serverUrl + "/upload/" + this.model.dummy.logs.models[this.model.dummy.logs.models.length-1].id, true);
			//xhr.setRequestHeader("X-FILENAME", file.name);
			xhr.send(file);*/
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
		updateTargetServer: function(server){
			$(".js-targetDataset-server-host", this.$el).html(server.get("host"));
			$(".js-targetDataset-server-port", this.$el).html(server.get("port"));
		},
		updateSourceServer: function(server){
			
		}
		


		

		

	});

	console.log("start transaction view loaded");
})(jQuery);

//https://www.google.com/settings/takeout/download?j=0146afa5-f7c7-4936-9eb8-5d00cca5a0d2&i=0