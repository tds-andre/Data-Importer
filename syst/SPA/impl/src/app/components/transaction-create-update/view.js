var app = app || {};
(function ($) {

	'use strict';	

	app.TransactionCreateUpdateView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		
		events: {
			'change  .js-radio'         : 'radioChanged',
			'click  .js-next'           : 'nextClicked',
			'click  .js-prev'           : 'prevClicked',
			'input  .js-dataset-select' : 'datasetSelected'
		},		
		
		options: {
			
		},	


		newOriginView: null,
		existingOriginView: null,
		newTargetView: null,
		existingTargetView: null,
		newTarget: false,
		newOrigin: false,
		currentStep: 1,		

		template: _.template($('#transaction-create-update-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			
		},		

		render: function () {
			var
				self = this;
			this.$el.html(this.template());				
			$(".js-wizard",this.$el).wizard();

			
			return this;		
		},

		start: function(options){
			this.options = _.extend(this.options, options)
			this.render();
			this.listenTo(this.collection, "reset", this.addOptions);
			this.collection.fetch({reset: true});
			return this;		
		},

		// Events ------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		radioChanged: function(ev){
			switch($(ev.currentTarget).val()){
				case "new-origin":
					this.newOriginView = this.showNew(this.newOriginView, true);
					this.newOrigin = true;
					break;
				case "existing-origin":
					this.showExisting(this.newOriginView, true);
					this.newOrigin = false;
					break;
				case "new-target":
					this.newTargetView = this.showNew(this.newTargetView, false);
					this.newTarget = true;
					break;
				case "existing-target":
					this.showExisting(this.newTargetView, false);
					this.newTarget = false;
					break;
				default:
					console.log($(ev.currentTarget).val());
			}	
		},

		nextClicked: function(ev){
			var
				goinTo = $(".js-wizard",this.$el).wizard("selectedItem");
			switch(goinTo){
				case 2:
					this.model = new app.TransactionModel();
					this.model.set("name", $(".js-title", this.$el).text());
					if(this.newOrigin){

					}else{
						var targetIndex = $(".js-transaction-create-update-origin-select", this.$el).val()
						var target = this.collection.models[targetIndex];
						this.model.set("target", target.href);
					}
					if(this.newTarget){

					}else{
						var originIndex = $(".js-transaction-create-update-target-select", this.$el).val()
						var origin = this.collection.models[targetIndex];
						this.model.set("origin", origin.href);
					}

					break;
				default:
					console.log(goinTo);
			}
			if(currentStep<2)
				currentStep++;
		},

		prevClicked: function(ev){
			var
				backinTo = $(".js-wizard",this.$el).wizard("selectedItem");
			switch(backinTo){
				default:
					console.log(backinTo);
			}
			if(currentStep>1)
				currentStep--;
		},

		datasetSelected: function(ev){
			var
				el, model, view;
			el = $(ev.currentTarget).parents(".js-existing-wrapper").find(".js-existing-el")[0];
			$(el).html("");
			model = this.collection.models[$(ev.currentTarget).val()];
			view = new app.DatasetDetailsView({el: el, model: model});
			view.start();
			
		},

		// Internal methods --------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		showNew: function(view, isSource){
			var
				caption = isSource? "origin" : "target";
			$(".js-transaction-create-update-"+caption+"-existing").hide();					
			if(view){						
				view.$el.show();
			}else{						
				view= new app.DatasetCreateUpdateView({el: $(".js-transaction-create-update-"+caption+"-new")[0]});
				view.start({showHeader:false, isSource: isSource});
				view.$el.show();				
			}
			return view;
		},
		
		showExisting: function(view, isSource){
			var
				caption = isSource? "origin" : "target";
			if(view)
				view.$el.hide();
			$(".js-transaction-create-update-"+caption+"-existing").show();					
		},


		genOption: function(name, val){
			return "<option value='"+val+"'>"+name+"</option>";
		},

		addOption: function(dataset, index){			
			$(".js-transaction-create-update-target-select", this.$el).append(this.genOption(dataset.get("name"), index));	
			$(".js-transaction-create-update-origin-select", this.$el).append(this.genOption(dataset.get("name"), index));
		},

		addOptions: function(){
			this.collection.each(this.addOption, this);
		}



	});
})(jQuery);