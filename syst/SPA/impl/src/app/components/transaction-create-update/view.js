var app = app || {};
(function ($) {

	'use strict';	

	app.TransactionCreateUpdateView = Backbone.View.extend({

		// Variables----------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //
		
		events: {
			'change .js-radio'         : 'radioChanged',		
			'input  .js-dataset-select' : 'datasetSelected'
		},		
		
		defaults: {
			
		},	

		template: _.template($('#transaction-create-update-template').html()),

		// Core --------------------------------------------------------------------------- //
		// -------------------------------------------------------------------------------- //

		initialize: function(){
			this.options = {},
			this.newOriginView= null,
			this.existingOriginView= null,
			this.newTargetView= null,
			this.existingTargetView= null,
			this.state = {
				newTarget: false,
				newOrigin: false,
				step: 1,
				originConfigured: false,
				targetConfigured: false,
				transactionSet: false
			}

		},		

		render: function () {
			var
				self = this;
			this.$el.html(this.template());				
			$(".js-wizard",this.$el).wizard();
			$(".js-wizard",this.$el).on("changed.fu.wizard", function(e,data){
				self.actionClicked(e, self);
			});
			$(".js-wizard",this.$el).on("finished.fu.wizard", function(e,data){
				self.finish();
			});
			
			return this;		
		},

		start: function(options){
			$.extend(true, this.options, this.defaults, options);
			this.render();
			this.collection.reset();
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
					this.state.newOrigin = true;
					break;
				case "existing-origin":
					this.showExisting(this.newOriginView, true);
					this.state.newOrigin = false;
					break;
				case "new-target":
					this.newTargetView = this.showNew(this.newTargetView, false);
					this.state.newTarget = true;
					break;
				case "existing-target":
					this.showExisting(this.newTargetView, false);
					this.state.newTarget = false;
					break;
				default:
					console.log($(ev.currentTarget).val());
			}	
		},

		actionClicked: function(ev, self){
			var
				self = self || this,
				goinTo = $(".js-wizard",this.$el).wizard("selectedItem").step,
				cominFrom = self.state.step;
			switch(goinTo){
				case 1: 
					$(".js-next", self.$el).removeAttr("disabled");
					self.state.step = 1;
					if(self.state.originConfigured && app.isDefined(self.newOriginView) && app.isDefined(self.newOriginView.model))
						self.newOriginView.model.destroy();
					if(self.state.targetConfigured && app.isDefined(self.newTargetView) && app.isDefined(self.newTargetView.model))
						self.newTargetView.model.destroy();
					self.state.originConfigured = false;
					self.state.targetConfigured = false;
					self.state.transactionSet = false;
					$(".js-step-2", this.$el).html("");
					break;

				case 2:					
					if(cominFrom==1){
						$(".js-next", self.$el).attr("disabled","disabled");
						self.state.step = 2;
						self.model = new app.TransactionModel();
						if(!app.isDefined($(".js-title", self.$el).val())){
							alert("De um nome à transção");
							return;
						}
						self.model.set("name", $(".js-title", self.$el).val());
						if(self.state.newOrigin){
							self.saveNew(self.newOriginView, "origin");
						}else{
							self.retrieveExisting("origin")
						}
						if(self.state.newTarget){
							self.saveNew(self.newTargetView, "target");
						}else{
							self.retrieveExisting("target");							
						}
						
					}
					self.state.step = 2;
					break;
				default:
					console.log(goinTo);
			}			
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
		finish: function(){
			var
				self = this;
			app.collections.transaction.persist(this.model,{
				success: function(e){
					self.trigger("created", this)
				},
				error: function(e){
					self.trigger("error",{message: "Erro ao salvar transação"})
				}
			})
		},


		datasetCreated: function(view){
			var
				self = view.parent,
				key = view.key,
				attr = key=="origin" ? "source" : "target";
		
			self.model.set(attr+"Dataset",view.model.href);			
			self.datasetSetup(key);
		},

		datasetError: function(view){
			var
				self = view.parent,
				caption = view.key == "origin" ? "origem":"destino",
				key =  view.key == "origin"?"Origen":"Target";
				
			$(".js-step-2", this.$el).append("<div>Erro ao criar dataset de "+view.key+".</div>");
			
			view.model.destroy();
			view.remove();
			view = null;
			
		},

		
		saveNew: function(view, key){
			view.on("new", this.datasetCreated);
			view.on("error", this.datasetError);
			view.key = key;
			view.saveClicked();
		},
		retrieveExisting: function(key){
			var 
				targetIndex = $(".js-transaction-create-update-"+key+"-select", this.$el).val(),
				target = this.collection.models[targetIndex],
				attr = key=="origin" ? "source" : "target";
			this.model.set(attr+"Dataset", target.href);
			this.datasetSetup(key);

		},
		
		datasetSetup: function(key){
			var
				caption = key=="origin"	? "origem": "destino"
			$(".js-step-2", this.$el).append("<div>Dataset de "+caption+" configurado.</div>");
			this.state[key+"Configured"] = true;
			

		
			if(this.state.targetConfigured && this.state.originConfigured){
				if(this.model.validate()){
					$(".js-next", this.$el).removeAttr("disabled");
					$(".js-step-2", this.$el).append("<div>Transação pronta. Clique em concluir para salva-la.</div>")
				}else{
					$(".js-step-2", this.$el).append("<div>Transação inválida! Esqueceu de dar um nome?.</div>")
				}
			}

		},


		showNew: function(view, isSource){
			var
				caption = isSource? "origin" : "target";
			$(".js-transaction-create-update-"+caption+"-existing").hide();					
			if(view){						
				view.$el.show();
			}else{						
				view= new app.DatasetCreateUpdateView({el: $(".js-transaction-create-update-"+caption+"-new")[0]});
				view.start({showHeader:false, isSource: isSource});
				view.parent = this;
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