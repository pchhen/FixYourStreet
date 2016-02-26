var express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        Issue = mongoose.model('Issue'),
        Action = mongoose.model('Action'),
        toolsFYS = require('toolsFYS');

module.exports = function (app) {
    app.use('/api/v1/issues', router);
};

router.post('/:id/comments', toolsFYS.CheckAuthorization, function (req, res, next) {
    req.issues.actions.push(req.body);
    req.issues.save(function (err, updatedIssues) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.send(updatedIssues.actions[updatedIssues.actions.length - 1]);
    });
});



router.post('/:id/statusChange/', toolsFYS.CheckAuthorization, function (req, res, next) {
    // Only allow Staff to add a user
    //var actionType = req.params.type;
    var issueId = req.params.id;
    Issue.findById(issueId, function (err, issue) {
        if (err) {
            res.status(500).send(err);
            return;
        } else if (!issue) {
            res.status(404).send('Issue not found');
            return;
        }
        //issue.status = req.body.status;
        issue.save(function (err, updatedIssue) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.send(updatedIssue);
        });
    });
});
