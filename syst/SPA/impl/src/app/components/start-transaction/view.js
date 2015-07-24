var app = app || {};

(function ($) {

	'use strict';	

	app.StartTransactionView = Backbone.View.extend({



		el: '#transaction-list-placeholder',

		template: _.template($('#start-transaction-template').html()),


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

		updateName: function(){
			$(".js-name", this.$el).html(this.model.get("name"));
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

