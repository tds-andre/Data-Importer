var app = app || {};
(function ($) {

	'use strict';	

	app.TransactionOperationView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		
		events: {
			//'click  .js-??????-button'  : 'buttonClicked',			
		},		
		
		defaults: {
			
		},

		
		
		template: _.template($('#transaction-operation-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			this.detailsView = null;
			this.uploadView = null;
			this.reportView = null;
			this.options = {};
		},		

		render: function () {
			var
				self = this,
				json = this.model.toJSON();
			this.$el.html(this.template(json));

			$(".js-wizard",this.$el).on("changed.fu.wizard", function(e,data){
				self.actionClicked(e, self);
			});

			this.detailsView = new app.TransactionDetailsView({model: this.model, el: $(".js-transaction-details-el", this.$el)[0]});
			this.detailsView.start();	


			return this;			
		},

		start: function(options){
			var
				self = this;
			$.extend(true, this.options, this.defaults, options);
			this.render();
			this.log = new app.LogModel();
			this.log.set("transaction", this.model.href);
			app.collections.log.persist(this.log, {success: function(){
				self.uploadView = new app.FileUploadView({el: $(".js-file-upload-el", self.$el)[0]});
				self.uploadView.start({url: app.config.serverUrl +"/log/" + self.log.id + '/upload'});
			}});
			
			
			return this;		
		},

		// View callbacks------------------------------------------------------------------ //
		// -------------------------------------------------------------------------------- //
		actionClicked: function(ev, self){
			var
				self = self || this,
				goinTo = $(".js-wizard",this.$el).wizard("selectedItem").step;
			switch(goinTo){
				case 2:
					

				break;
			}
		}
	

		// Other callbacks----------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		

		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

	});
})(jQuery);