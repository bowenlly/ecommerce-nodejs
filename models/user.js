// Data Model for Users
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");
const SALT_FACTOR = 10;


// Data model for users
const userSchema = new Schema(
  {
    username: {type: String, required: true, unique: true },
    password: {type: String, required: true},
    created: { type: Date, default: Date.now },
    kind: {type: String, required: true},
    name: {type: String},
    age: Number,
    gender: {type: String},
    street: {type: String},
    city: {type: String},
    state: {type: String},
    zipcode: {type: String},
    marriage: {type: String},
    income: {type: String},
    business_category: {type: String},
    annual_income: {type: String},
    admin: { type: Boolean, default: false }
  }, { versionKey: false }
);



// Encrypting the password
var noop = function() {};
userSchema.pre("save", function(done) {
  var user = this;
  if (!user.isModified("password")) {
    return done();
  }
  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) { return done(err); }
    bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
      if (err) { return done(err); }
      user.password = hashedPassword;
      done();
    }); 
  });
});

// checking password function
userSchema.methods.checkPassword = function(guess, done) {
  bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

// Export model
module.exports = mongoose.model("user", userSchema);