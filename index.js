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
require('dotenv').config();

//stormpath
var stormpath = require('stormpath');
var apiKey = new stormpath.ApiKey(
  process.env.STORMPATH_CLIENT_APIKEY_ID,
  process.env.STORMPATH_CLIENT_APIKEY_SECRET
);
var client = new stormpath.Client({ apiKey: apiKey });
var applicationHref = process.env.STORMPATH_APPLICATION_HREF;

client.getApplication(applicationHref, function(err, application) {
  console.log('Application:', application);
});

//stormpath-end

app.use("/static", express.static("public"));
app.use("/vendor", express.static("bower_components"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));




// //////////////////////////////////////////////
// // create a session
// app.use(
// 	session({
// 		//use keygen to generate a secret key
// 		secret: keygen._({specials: true}),
// 		resave: false, 
// 		saveUninitialized: true
// 	})
// );

// //////////////////////////////////////////////
// // extending the req object to manage sessions
// app.use(function (req, res, next) {
// 	//login a user
// 	req.login = function (user) {
// 		req.session.userId = user._id; 
// 	};
// 	//find the current user
// 	req.currentUser = function (cb) {
// 		db.User.findOne({_id: req.session.userId }, function (err, user) {
// 			req.user = user; 
// 			cb(null, user);
// 		})
// 	};
// 	//logout the current user
// 	req.logout = function () {
// 		req.session.userId = null;
// 		req.user = null; 
// 	}
// 	//call the middleward in the stack
// 	next();
// });

//////////////////////////////////////////////
// routes


app.get("/", function (req, res) {
	res.sendFile(views + "/index.html");
});

//signup api route
app.post("/users", function createUser (req, res) {
	db.User.createSecure(req.body.email, req.body.password, function (err, users) {
		if(err) {
			res.redirect("/");
		} else {
			req.login(users);
			res.redirect("/maps");
		}
	});
});


app.get("/maps", function (req, res) {
	req.currentUser(function (err, currentUser) {
		if (err || currentUser === null) {
			res.redirect("/")
		} else {
		res.sendFile(views + "/maps.html");
		}
	});
});

app.get("/api/users/:id", function (req, res) {
	req.currentUser(function (err, currentUser) {
		if (err || currentUser === null) {
			res.redirect("/")
		} else {
			res.send(currentUser);
		}
	});
});


app.get("/profiles", function (req, res) {
	req.currentUser(function (err, currentUser) {
		if (err || currentUser === null) {
			res.redirect("/")
		} else {
		res.sendFile(views + "/profiles.html");
		}
	});
});


app.get("/api/coolSpots", function (req, res) {
	db.CoolSpot.find({}, function (err, spots) {
		res.send(spots);
	});
});



//login api route
app.post(["/login", "/api/sessions"], function signInUser (req, res) {
	db.User.authenticate(req.body.email, req.body.password, function (err, users) {
		if(err) {
			res.redirect("/");
		} else {
			req.login(users);
			res.redirect("/maps");
		}
	});
});

//logout api route
app.delete(["/sessions", "/logout"], function (req, res) {
	req.logout();
	res.redirect("/");
}); 


//search for a city 
app.post("/api/city", function handleCity (req, res) {
	res.send(req.body)
});



//////////////////////////////////////////////////////
// Server
app.listen((process.env.PORT || 3000), function (){
  console.log("listening on port 3000");
});