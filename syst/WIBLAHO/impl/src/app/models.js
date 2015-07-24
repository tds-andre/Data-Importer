var app = app || {}


(function(){
	'use strict';

	app.Dataset = new Wiblaho.Model('dataset',{
		inherited:{},
		nested:{
			server: {
				model: app.Server,
				fetchMode: Wiblaho.FetchMode.EAGER;
				relationType: Wiblaho.RelationType.AGREGATE,
				relationMultiplicity: 1,
				nullable: false
			}
		}
	})

	app.Transaction = new Wiblaho.Model('transaction',{		
		inherited:{},
		nested:{
			sourceDataset: {
				model: app.Dataset,
				fetchMode: Wiblaho.FetchMode.EAGER,
				relationType: Wiblaho.RelationType.AGREGATE,
				relationMultiplicity: 1,
				nullable: false
			},
			targetDataset{
				model: app.Dataset,
				fetchMode: Wiblaho.FetchMode.EAGER,
				relationType: Wiblaho.RelationType.AGREGATE
				relationMultiplicity: 1
				nullable: false
			},
			mapping: {
				model: app.Mapping,
				fetchMode: Wiblaho.FetchMode.EAGER,
				relationType: Wiblaho.RelationType.AGREGATE,
				relationMultiplicity: 1,
				nullable: true

			}
		}

	});
})()