var mongoose = require('mongoose');

// page schema

var DataSchema= mongoose.Schema({

name: {

	type: String,
	required: true
},

zipcode: {

	type: String,
	required:true
	
},


size: {

	type: String,
	required: true
},

bedroom: {

	type: String,
	required:true
},
lat: {

	type: String,
	required:true
},
lon: {

	type: String,
	required:true
},




});





var Data = module.exports = mongoose.model('Data', DataSchema);