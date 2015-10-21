var app = app || {};
(function ($) {

	'use strict';	

	app.UploadSchemaView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		
		events: {
			//'click  .js-??????-button'  : 'buttonClicked',			
		},		
		
		defaults: {
			
		},	

		template: _.template($('#upload-schema-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			this.options = {};
			this.uploadView = null;
			this.schemaView = null;
		},		

		render: function () {
			var
				self =this;
			this.$el.html(this.template());
			this.model.nest();

			this.uploadView = new app.FileUploadView({el: $('.js-upload-el',this.$el)[0]});
			this.uploadView.start({flat: true, url: app.domain.UploadCollection.prototype.uploadUrl(this.model), success: function(){
				$('.js-schema-el',self.$el).html("");
				self.schemaView = new app.SchemaTableView({collection:self.model.get('fields'), el:$('.js-schema-el',self.$el)[0]});
				self.schemaView.start({fetched: false});
			}});
			this.model.get("fields").reset();			
			this.listenTo(this.model.get('fields'), "reset", function(){
				self.schemaView = new app.SchemaTableView({collection:this.model.get('fields'), el:$('.js-schema-el',this.$el)[0]});
				self.schemaView.start({fetched: true});	
			});
			this.model.get("fields").fetch({url: this.model.get("fields").href, reset: true});
			

			return this;			
		},

		start: function(options){
			$.extend(true, this.options, this.defaults, options);
			this.render();
			return this;		
		},

		// View callbacks------------------------------------------------------------------ //
		// -------------------------------------------------------------------------------- //

		buttonClicked: function(ev){}

		// Other callbacks----------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

	});
})(jQuery);