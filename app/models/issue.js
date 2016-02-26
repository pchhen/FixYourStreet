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

var StatusAvailable = 'created acknowledged assigned in_progress solved rejected'.split(' ');
var IssueSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true, enum: StatusAvailable },
  location: { type: [Number], index: { type: '2dsphere', sparse: true}},
  author: {type: Schema.Types.String, ref: 'User'},// Contain the full username, no need of populating
  assignedStaff: {type: Schema.Types.String, ref: 'User'}, // Contain the full username, no need of populating
  type: {type: Schema.Types.String, ref: 'Type'},// Contain the full tagname, no need of populating
  tags:{type: Array},
  actions:[ActionSchema]
});

mongoose.model('Issue', IssueSchema);
