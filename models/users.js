var mongoose = require("mongoose");



var Schema = mongoose.Schema;
bcrypt = require("bcrypt");


var UserSchema = new Schema({
	email: {type: String, required: true}, 
	passwordDigest: {type: String, required: true}, 
	createdAt: {type: Date, default: Date.now()},
	coolSpots: [/*CoolSpotSchema*/]
});

//create a new user with a hashed password for signup
UserSchema.statics.createSecure = function (email, password, cb) {
	var _this = this; 
	bcrypt.genSalt(function (err, salt) {
		bcrypt.hash(password, salt, function (err, hash) {
			var user = { 
				email: email, 
				passwordDigest: hash
			};
			_this.create(user, cb)
		});
	});
};

//authenticate user
UserSchema.statics.authenticate = function (email, password, cb) {
	this.findOne({email: email}, function (err, user) {
		if (user === null) {
			cb("Can\'t find user with that email", null);
		} else if (user.checkPassword(password)) {
			cb(null, user);
		} else {
			cb("password incorrect", user)
		}
	});
};

//compare password user enters with a hashed password
UserSchema.methods.checkPassword = function (password) {
	return bcrypt.compareSync(password, this.passwordDigest);
};

var User = mongoose.model("User", UserSchema);
module.exports = User;
















