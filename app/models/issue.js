var mongoose = require('mongoose'),
        Action = mongoose.model('Action'),
        Schema = mongoose.Schema;


var StatusAvailable = 'created acknowledged assigned in_progress solved rejected'.split(' ');
var IssueSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: String, required: true, enum: StatusAvailable},
    location: {type: [Number], index: {type: '2dsphere', sparse: true}},
    author: {type: Schema.Types.String, ref: 'User'}, // Contain the full username, no need of populating
    assignedStaff: {type: Schema.Types.String, ref: 'User'}, // Contain the full username, no need of populating
    type: {type: Schema.Types.String, ref: 'Type'}, // Contain the full tagname, no need of populating
    tags: {type: Array},
    actions: [Action]
});

mongoose.model('Issue', IssueSchema);
