var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ActionTypes = 'statutChange comment'.split(' ');
var ActionSchema = new Schema({
  type: { type: String, required: true, enum: ActionTypes },
  content: { type: String, required: true },
});

ActionSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
});

mongoose.model('Action', ActionSchema);
