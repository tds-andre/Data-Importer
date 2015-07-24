Wiblaho.Model =  function(key, _args){
	var args = _args || {},
		args.inherited = args.inherited || {},
		args.nested = args.nested || {};

	Wiblaho.Model.prototype.models[key] = this;



}

Wiblaho.Model.prototype.models = {}