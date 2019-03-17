var express= require('express');

var router = express.Router();

var Data = require('./models/data');
var zipcodes = require('zipcodes');


//python prediction libs
var spawn = require("child_process").spawn;






router.get('/', function(req,res){


res.render('index',{

	test:"home page"
});

});



router.get('/check', function(req,res){

 var zip = zipcodes.lookup(40010);
res.render('Check',{

zip: zip.latitude
	
});
});



//post check

  		
  





module.exports= router;