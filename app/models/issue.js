var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var ValidationError = mongoose.Error.ValidationError;
var ValidatorError  = mongoose.Error.ValidatorError;


var StatusAvailable = 'created acknowledged assigned in_progress solved rejected'.split(' ');
var ActionTypes = 'statusChange comment'.split(' ');

var ActionSchema = new Schema({
  type: { type: String, required: true, enum: ActionTypes },
  content: { type: String, required: true },
  author: {type: Schema.Types.String, ref: 'User'},
  createdAt:{type: Date, default: Date.now},
});

// Validate the content (just before saving) if the type is statusChange
ActionSchema.pre('save', function(next) {
    if(this.type === "statusChange"){
        if(StatusAvailable.indexOf(this.content) <= -1){
          // Custom validationError (not really clean, can be improved probably)
          var error = new ValidationError(this);
          error.errors.content = new ValidatorError('content');
          error.errors.content.message = "Content doesn't contain valid statusChange";
          return next(error);
        }
    }
    next();
});

// Validate if the author exist
ActionSchema.path('author').validate(function (value, respond) {
    mongoose.model('User').findById({_id:value},function(err,result){
      if (err) {
          res.status(500).send(err);
          return;
      }
      if(!result){
          respond(false, 'There\'s no author like this');
      }else{
          respond(true,'Ok the author is known');
      }
    });
});

mongoose.model('Action', ActionSchema);

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
          respond(true,'Ok the issue is known');
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
          respond(false, 'There\'s no author like this');
      }else{
          respond(true,'Ok the author is known');
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
          respond(false, 'There\'s no assigned staff like this');
      }else{
          respond(true,'Ok the assigned staff is known');
      }
    });
});

mongoose.model('Issue', IssueSchema);
