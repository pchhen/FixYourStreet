var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TagSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }
});

mongoose.model('Tag', TagSchema);
