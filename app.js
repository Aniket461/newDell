var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var path = require('path');
var zipcodes = require('zipcodes');

var Data = require('./models/data');
var spawn= require('child_process').spawn;

//connect to db

mongoose.connect(config.database, {useNewUrlParser: true});

var db= mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){

console.log('connected to mongo DB');

});




app = express();

// body parser middleware

//parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'public')));




//express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  //cookie: { secure: true }
}));



// express validator middleware

app.use(expressValidator({

errorFormatter: function(param,msg,value){

	var namespace= param.split('.')
	, root = namespace.shift()
	, formParam = root;

	while(namespace.length){
		formParam += '[' + namespace.shift() + ']';
	}
	return{

		param: formParam,
		msg: msg,
		value

	};
}
}));

// body parser middleware

app.use(bodyParser.urlencoded({extended: false}));
//parse application/json
app.use(bodyParser.json());




//express messages middleware

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});




// global errors

app.locals.errors = null;
app.locals.zip = null;




var index = require('./index');

app.use('/', index);

app.locals.test = null;
global.price = "";











app.post('/submit-check', function(req,res){

 var name = req.body.name;
 var zipcode = req.body.zipcode;
 var size = req.body.size;
 var bedroom = req.body.bedroom;



 req.checkBody('name', 'Name is required!').notEmpty();
 req.checkBody('zipcode', 'Zipcode is required!').notEmpty();
 req.checkBody('size', 'Please specify the size of property').notEmpty();
 req.checkBody('bedroom', 'Please specify number of bedrooms in your property').notEmpty();
 
 var errors = req.validationErrors();
  if(errors){

  	res.render('Check',{
  		errors:errors
  	});
  }
  else{

  	var zip = zipcodes.lookup(zipcode);

  	var latitude = zip.latitude;
  	var longitude = zip.longitude;

  	console.log(latitude);
  	console.log(longitude);




  				var data = new Data({

  					name: name,
  					zipcode: zipcode,
  					size: size,
  					bedroom: bedroom,
  					lat: latitude,
  					lon: longitude
  					
  				});

  				

  						data.save(function(err){

  							if(err) console.log(err);

  							else{

                  var process = spawn('python',["predict.py"]);
                  var datainputforpy = JSON.stringify([data.zipcode, data.size, data.bedroom, data.lat, data.lon])
                  process.stdin.write(datainputforpy)
                  process.stdin.end()
                  process.stdout.on('data',function(chunk){

                      var textChunk = chunk.toString('utf8');// buffer to string
                      //This is our result please print it
                      console.log(textChunk);
                  });

                  process.stderr.on('data', (error) => {
                      
                      var textChunk = error.toString('utf8');// buffer to string
                      console.log(textChunk);
                  });

  								req.flash('success', 'Data added successfully. Please wait for prediction');
                  
  								res.redirect('result');
  							}

  						});

  					}
 
  					});


app.get('/result', function(req,res){




res.render('result',{

res:"5"
  
});
});










app.listen(process.env.PORT || 5000, function(err){

if(err) console.log(err);

else console.log("connected to the server");


});

