var express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        Issue = mongoose.model('Issue'),
        Action = mongoose.model('Action'),
        toolsFYS = require('toolsFYS');

module.exports = function (app) {
    app.use('/api/v1/issues', router);
};

/*
 params:
 issues ->
 user
 type
 region
 distance
 limit
 statusIs
 statusIsNot
 since
 until
 issues/:id/actions ->
 type
 content

 */

router.post('/', function (req, res, next) {

    var issue = new Issue(req.body);

    issue.save(function (err, createdIssue) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.send(createdIssue);
    });
});

router.put('/:id', findIssue, function (req, res, next) {
    issue.name = req.body.name;
    issue.description = req.body.description;
    issue.status = req.body.status;
    issue.location = req.body.location;
    issue.author = req.body.author;
    issue.assignedStaff = req.body.assignedStaff;
    issue.type = req.body.type;
    issue.tags = req.body.tags;
    issue.action = req.body.action;

    issue.save(function (err, updatedIssue) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.send(updatedIssue);
    });
});

router.get('/:id', findIssue, function (req, res, next) {
    res.send(issue);
});

router.get('/', function (req, res, next) {

    var criteria = {};
    if (req.query.author) {
        criteria.author = req.query.author;
    }
    if (req.query.types) {
        criteria.type = req.query.type;
    }

    Issue.find(criteria).populate('action').exec(function (err, issues) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.send(issues);
    });

});

router.post('/:id/comments', toolsFYS.CheckStaffAuthorization, findIssue, function (req, res, next) {
    issue.actions.push(req.body);

    issue.save(function (err, updatedIssue) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.send(updatedIssue.actions[updatedIssue.actions.length -1]);
    });
});



router.post('/:id/statuschanges', toolsFYS.CheckStaffAuthorization, findIssue, function (req, res, next) {
    issue.actions.push(req.body);

    issue.save(function (err, updatedIssue) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.send(updatedIssue.actions[updatedIssue.actions.length -1]);
    });
});

/**
 * Middleware that finds the issue corresponding to the :id URL parameter
 * and stores it in `req.issue`.
 */
function findIssue(req, res, next) {
  Issue.findById(req.params.id, function (err, issue) {
      if (err) {
          res.status(500).send(err);
          return;
      } else if (!issue) {
          res.status(404).send('Issue not found');
          return;
      }
      req.issue = issue;

      next();
  });
}
