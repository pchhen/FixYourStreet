var express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        Issue = mongoose.model('Issue'),
        Action = mongoose.model('Action'),
        toolsFYS = require('toolsFYS');

module.exports = function (app) {
    app.use('/api/v1/actions', router);
};

router.put('/:id', toolsFYS.CheckAuthorization, function (req, res, next) {
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
        
        issue.status = req.body.status;
        
        issue.save(function (err, updatedIssue) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.send(updatedIssue);
        });
    });


//    if (actionType == "comment") {
//        var issueId = req.params.id;
//        Issue.findById(issueId, function (err, issue) {
//            if (err) {
//                res.status(500).send(err);
//                return;
//            } else if (!issue) {
//                res.status(404).send('Issue not found');
//                return;
//            }
//
//            issue.status = req.body.status;
//
//            issue.save(function (err, updatedIssue) {
//                if (err) {
//                    res.status(500).send(err);
//                    return;
//                }
//                res.send(updatedIssue);
//            });
//        });
//    }

//    if (actionType == "statutChange") {
//        if (req.userRole == 'staff') {
//
//
//        } else {
//            res.status(403).send('User not authorized');
//            return;
//        }
//    }
});