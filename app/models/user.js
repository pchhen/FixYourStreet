/*
  Password Hashing
  For further improvement
  http://stackoverflow.com/questions/14588032/mongoose-password-hashing
  http://blog.mongodb.org/post/32866457221/password-authentication-with-mongoose-part-1
*/
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var RolesAvailable = 'citizen staff'.split(' ');
var UserSchema = new Schema({
  _id: { type:String, required:true}, /*contain Username for referencing optimisation in issue. Unique by default */
  role: { type: String, enum: RolesAvailable },
  password: { type: String, required: true }
});

mongoose.model('User', UserSchema);
