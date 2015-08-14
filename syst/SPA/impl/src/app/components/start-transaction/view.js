var app = app || {};

(function ($) {

	'use strict';	

	app.StartTransactionView = Backbone.View.extend({

		el: '#transaction-list-placeholder',

		events: {
			'change .js-file'  : 'fileSelected',
			'click  .actions'  : 'stepClicked'
			

		},

		template: _.template($('#start-transaction-template').html()),

		progress: 0,
		uploading: false,
		uploaded: false,
		step: 1,

		stepClicked: function(ev){
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

		fileSelected: function(event){
			var
				form = $(event.currentTarget).parent()[0],
				formData = new FormData(form),
				log = this.model.lastLog(),
				self = this;
			log.upload(formData,{
				success: function(data){
					console.log("upload concluído");
					self.setFile();
				},
				error: function(a,b,c){
					console.log("upload fracassado");
					console.log(a,b,c);
					self.unsetFile();
				},
				progress: function(event){
					self.setProgress(parseInt(event.loaded/event.total * 100));
				}
			})
		},

		
		setFile: function(filename){
			this.uploading = false;
			this.uploaded = true;		
			this.completeProgress();
			this.changeStep(2);
		},



		unsetFile: function(){
			this.uploading = false;
			this.uploaded = false;
			this.resetProgress();			
		},

		completeProgress: function(){
			this.progress = 100;
			this.updateUploadMessage("Arquivo carregado");			
			this.updateProgress(100);
			var $progress = $(".js-progress", this.$el);
			$progress.removeClass("progress-bar-warning");
			$progress.addClass("progress-bar-success");
			$progress.parent().removeClass("active");
		},

		resetProgress: function(){
			this.progress = 0;
			this.updateUploadMessage("Sem arquivo");			
			this.updateProgress(100);
			var $progress = $(".js-progress", this.$el);
			$progress.removeClass("progress-bar-success");
			$progress.addClass("progress-bar-warning");
			$progress.parent().addClass("active");
		},

		setProgress: function(val){
			this.progress = val;
			this.updateProgress(this.progress);
			this.updateUploadMessage("Carregand arquivo ("+this.progress+"%)");
		},

		updateProgress: function(val){
			var $progress = $(".js-progress", this.$el);
			$progress.css("width", val + "%");
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