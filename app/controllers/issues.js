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

 /**
  * @api {post} /issues/ Create a new Issue
  * @apiVersion 0.0.1
  * @apiName PostIssue
  * @apiGroup Issue
  * @apiHeader {String} X-USERID Username.
  * @apiHeader {String} X-USERHASH Password hashed of the Username.
  * @apiPermission citizen
  *
  * @apiParam {String} name Name of the Issue
  * @apiParam {String} description Description of the Issue
  * @apiParam {Array} location Type of geometry and position
  * @apiParam {String} [location.type=point] Longitude and Latitude
  * @apiParam {Number[]} location.coordinates Longitude and Latitude
  * @apiParam {String} author Author of the Issue
  * @apiParam {String} [assignedStaff] Staff assigned to work on the Issue
  * @apiParam {String} type Type of the Issue
  * @apiParam {String[]} tags Keywords describing the Issue
  * @apiParam {Object} actions List of actions - Comments and StatusChanges (Array of Strings)
  * @apiParam {String=comment,statusChange} actions.type Type of the action
  * @apiParam {String} actions.content Description for comment action or status for statusChange action
  * @apiParam {Date} [actions.createdAt=now] Date of the action
  *
  * @apiSuccess {String} _id Id of the Issue
  * @apiSuccess {String} name Name of the Issue
  * @apiSuccess {String} description Description of the Issue
  * @apiSuccess {Array} location Type of geometry and position
  * @apiSuccess {String} location.type=point Longitude and Latitude
  * @apiSuccess {Number[]} location.coordinates Longitude and Latitude
  * @apiSuccess {String} author Author of the Issue
  * @apiSuccess {String} assignedStaff Staff assigned to work on the Issue
  * @apiSuccess {String} type Type of the Issue
  * @apiSuccess {String[]} tags Keywords describing the Issue
  * @apiSuccess {Object} actions List of actions - Comments and StatusChanges (Array of Strings)
  * @apiSuccess {String} actions.type Type of the action
  * @apiSuccess {String} actions.content Description for comment action or status for statusChange action
  * @apiSuccess {Date} actions.createdAt=now Date of the action
  * @apiSuccess {String} actions._id Id of the Issue
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {
        "name": "Grafiti",
        "description": "A nice drawin on my window shop ",
        "status": "created",
        "author": "joe",
        "type": "Streetlight",
        "_id": "56d1c54c77048d1005ea7416",
        "actions": [
          {
            "type": "statutChange",
            "content": "created",
            "author": "joe",
            "createdAt": "2016-02-27T16:42:19.565Z",
            "_id": "56d1c54c77048d1005ea7417"
          }
        ],
        "tags": [
          "baba"
        ],
        "location": {
          "coordinates":[10.5,41.9],
          "type": "point"
        },
      }
  */

router.post('/',toolsFYS.CheckCitizenAuthorization, function (req, res, next) {

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
    res.send(req.issue);
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
    issue = req.issue;
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
    issue = req.issue;
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
