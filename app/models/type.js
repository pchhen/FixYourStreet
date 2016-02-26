var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TypeSchema = new Schema({
  _id: { type: String, required: true }, /*contain the name for referencing optimisation in issue. Unique by default */
  description: { type: String, required: true }
});

mongoose.model('Type', TypeSchema);
