/*
https://github.com/blakehaswell/mongoose-unique-validator
http://stackoverflow.com/questions/14588032/mongoose-password-hashing
http://blog.mongodb.org/post/32866457221/password-authentication-with-mongoose-part-1
*/
var uniqueValidator = require('mongoose-unique-validator');
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var RolesAvailable = 'citizen staff'.split(' ');
var UserSchema = new Schema({
  _id: { type:String, required:true}, /*contain Username for referencing optimisation in issue. Unique by default */
  role: { type: String, required: true, enum: RolesAvailable },
  password: { type: String, required: true }
});

UserSchema.plugin(uniqueValidator);
mongoose.model('User', UserSchema);
