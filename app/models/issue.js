var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var ActionTypes = 'statutChange comment'.split(' ');
var ActionSchema = new Schema({
  type: { type: String, required: true, enum: ActionTypes },
  content: { type: String, required: true },
  author: {type: Schema.Types.String, ref: 'User'},
  createdAt:{type: Date, default: Date.now},
});

// Validate if the author exist
ActionSchema.path('author').validate(function (value, respond) {
    mongoose.model('User').findById({_id:value},function(err,result){
      if (err) {
          res.status(500).send(err);
          return;
      }
      if(!result){
          respond(false, 'There\'s no issue type like this');
      }else{
          respond(true,'Ok the type is known');
      }
    });
});

mongoose.model('Action', ActionSchema);

var StatusAvailable = 'created acknowledged assigned in_progress solved rejected'.split(' ');
var IssueSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: String, default:"created", enum: StatusAvailable},
    location: {
        type: {type: String, default: "Point"},
        coordinates: {type: [Number], required: true}// Order: longitude, latitude
    },
    author: {type: Schema.Types.String, ref: 'User', required:true}, // Contain the full username, no need of populating
    assignedStaff: {type: Schema.Types.String, ref: 'User'}, // Contain the full username, no need of populating
    type: {type: Schema.Types.String, ref: 'Type', required:true}, // Contain the full typename, no need of populating
    tags: {type: Array},
    actions: {type: [ActionSchema], required: true}
});

IssueSchema.index({
	location: '2dsphere'
});

// Validate if the type exist
IssueSchema.path('type').validate(function (value, respond) {
    mongoose.model('IssueType').findById({_id:value},function(err,result){
      if (err) {
          res.status(500).send(err);
          return;
      }
      if(!result){
          respond(false, 'There\'s no issue type like this');
      }else{
          respond(true,'Ok the type is known');
      }
    });
});

// Validate if the author exist
IssueSchema.path('author').validate(function (value, respond) {
    mongoose.model('User').findById({_id:value},function(err,result){
      if (err) {
          res.status(500).send(err);
          return;
      }
      if(!result){
          respond(false, 'There\'s no issue type like this');
      }else{
          respond(true,'Ok the type is known');
      }
    });
});

// Validate if the assignedStaff exist
IssueSchema.path('assignedStaff').validate(function (value, respond) {
    mongoose.model('User').findById({_id:value},function(err,result){
      if (err) {
          res.status(500).send(err);
          return;
      }
      if(!result){
          respond(false, 'There\'s no issue type like this');
      }else{
          respond(true,'Ok the type is known');
      }
    });
});

mongoose.model('Issue', IssueSchema);
