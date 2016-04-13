var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var db = require("./models");
var session = require("express-session");
var ejs = require("ejs");
var keygen = require("keygenerator");
var methodOverride = require("method-override");
var views = path.join(process.cwd(), "views/");
var morgan = require('morgan');
var pry = require('pryjs');
require('dotenv').config();

//stormpath
var stormpath = require('stormpath');
var apiKey = new stormpath.ApiKey(
  process.env.STORMPATH_CLIENT_APIKEY_ID,
  process.env.STORMPATH_CLIENT_APIKEY_SECRET
);
var client = new stormpath.Client({ apiKey: apiKey });
var applicationHref = process.env.STORMPATH_APPLICATION_HREF;
var application;

//stormpath-end

app.use("/static", express.static("public"));
app.use("/vendor", express.static("bower_components"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(morgan('dev'));

////////////////////////////////////// api routes /////////////////////////////////////////////

app.get("/", function (req, res) {
	client.getApplication(applicationHref, function(err, application) {
	  	console.log('Application_inside:', application);
		res.sendFile(views + "/index.html");
	});  
});


app.post("/signup", function(req, res) {
	client.getApplication(applicationHref, function(err, application) {
	  	
	  	var account = {
			  givenName: req.body.signUpGivenName,
			  surname: req.body.signUpsurame,
			  username: req.body.signUpEmail,
			  email: req.body.signUpEmail,
			  password: req.body.signUpPassword
			};

			application.createAccount(account, function(err, createdAccount) {
				if (err) {
					console.log(err);
				}
			  console.log('Account:', createdAccount);
			});
			
			res.sendFile(views + "/maps.html");
		
	});
}); 

app.post("/login", function (req, res) {
	client.getApplication(applicationHref, function(err, application) {
		var authRequest = {
		  username: req.body.loginEmail,
		  password: req.body.loginPassword
		};

		application.authenticateAccount(authRequest, function(err, result) {
			if (err) {
				console.log(err);
				res.sendFile(views + "/index.html");
				return 
			}

		  result.getAccount(function(err, account) {
		    console.log('Account:', account);
		    res.sendFile(views + "/maps.html");
		  });

		});
	});
});


//logout api route
app.delete(["/sessions", "/logout"], function (req, res) {
	req.logout();
	res.redirect("/");
}); 

		// application.getAccounts({}, function(err, accounts) {
		//   accounts.each(function(account, callback) {
		//     console.log('Account:', account);
		//     callback();
		//   }, function(err) {
		//     console.log('Finished iterating over accounts.');
		//   });
		// });


// req.currentUser(function (err, currentUser) {
	// 	if (err || currentUser === null) {
	// 		res.redirect("/")
	// 	} else {
		// res.sendFile(views + "/maps.html");
	// 	}
	// });

app.get("/maps", function (req, res) {
	res.sendFile(views + "/maps.html");
	
});


// Server
// app.on(stormpath.ready, function() {
	app.listen((process.env.PORT || 3000), function (){
	  console.log("listening on port 3000");
	});	
// });





