Wiblaho = Wiblaho || {}

(function($){
	'use strict'
	Wiblaho.Services = Wiblaho.Services || {}
	$(function(){
		$("body").append('<div id = "wiblaho-templates"></div>');
	})
	Wiblaho.Services.templates = {
		url: "http://localhost"
		templates: {}	
		init: function(url){
			this.url = url || this.url;
		}
		load: function(componentName){

		},
		get: function(componentName){
			if(isDefined(templates[componentName]))
				return templates.$el.clone();
		}
	}

})(jQuery)