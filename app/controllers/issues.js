var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Issue = mongoose.model('Issue'),
  toolsFYS = require('toolsFYS');

module.exports = function (app) {
  app.use('/api/v1/issues', router);
};


/**
 * @api {post} /tags/ Create a tag
 * @apiName PostTag
 * @apiGroup Tag
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} _id username
 * @apiSuccess {String} description  Lastname of the User.
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

// PUT /api/tags/:id
router.put('/:id', function (req, res, next) {

  var issueId = req.params.id;

  Issue.findById(issueId, function(err, issue) {
    if (err) {
      res.status(500).send(err);
      return;
    } else if (!issue) {
      res.status(404).send('Issue not found');
      return;
    }

    issue._id = req.body._id;
    issue.name = req.body.name;
    issue.description = req.body.description;
    issue.status = req.body.status;
    issue.location = req.body.location;
    issue.author = req.body.author;
    issue.assignedStaff = req.body.assignedStaff;

    issue.save(function(err, updatedIssue) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(updatedIssue);
    });
  });
});

router.get('/:id', function (req, res, next) {

  var issueId = req.params.id;

  Issue.findById(issueId, function(err, issue) {
    if (err) {
      res.status(500).send(err);
      return;
    } else if (!issue) {
      res.status(404).send('Issue not found');
      return;
    }

    res.send(issue);
  });
});
