var express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        Issue = mongoose.model('Issue'),
        Action = mongoose.model('Action'),
        toolsFYS = require('toolsFYS');

module.exports = function (app) {
    app.use('/api/v1/issues', router);
};

 /**
  * @api {post} /issues/ Create a new Issue
  * @apiVersion 0.0.1
  * @apiName PostIssue
  * @apiGroup Issues
  * @apiHeader {String} X-USERID Username.
  * @apiHeader {String} X-USERHASH Password hashed of the Username.
  * @apiPermission citizen
  *
  * @apiParam {String} name Name of the Issue
  * @apiParam {String} description Description of the Issue
  * @apiParam {Array} location Type of geometry and position
  * @apiParam {String=Point,LineString,Polygon,MultiPoint,MultilineString,MultiPolygon} [location.type=point] Type of GeoJSON objects
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
  * @apiSuccess {String=created,acknowledged,assigned,in_progress,solved,rejected} status Status of the Issue
  * @apiSuccess {Array} location Type of geometry and position
  * @apiSuccess {String=Point,LineString,Polygon,MultiPoint,MultilineString,MultiPolygon} location.type=point Type of GeoJSON objects
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
            "type": "statusChange",
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
  *@apiError BadRequest Wrong author or statusChange - Author of the issue should be the same author as the first statusChange action which should also be "created"
  */

router.post('/',toolsFYS.CheckCitizenAuthorization, function (req, res, next) {

    //Check: Author of the issue should be the same author as the first statusChange action which should also be "created"
    if((req.body.author == req.body.actions[0].author) && (req.body.actions[0].content == 'created')){
      var issue = new Issue(req.body);

      issue.save(function (err, createdIssue) {
          if (err) {
              res.status(500).send(err);
              return;
          }

          res.send(createdIssue);
      });
    }else{
      res.status(400).send('Wrong authors or statusChange');
      return;
    }
});

/**
 * @api {put} /issues/:id Update an Issue
 * @apiVersion 0.0.1
 * @apiName PutIssue
 * @apiGroup Issues
 * @apiHeader {String} X-USERID Username.
 * @apiHeader {String} X-USERHASH Password hashed of the Username.
 * @apiPermission staff
 *
 * @apiParam {String} [name] Name of the Issue
 * @apiParam {String} [description] Description of the Issue
 * @apiParam {Array} [location] Type of geometry and position
 * @apiParam {String=Point,LineString,Polygon,MultiPoint,MultilineString,MultiPolygon} [location.type=point] Type of GeoJSON objects
 * @apiParam {Number[]} [location.coordinates] Longitude and Latitude
 * @apiParam {String} [author] Author of the Issue
 * @apiParam {String} [assignedStaff] Staff assigned to work on the Issue
 * @apiParam {String} [type] Type of the Issue
 * @apiParam {String[]} [tags] Keywords describing the Issue
 *
 * @apiSuccess {String} _id Id of the Issue
 * @apiSuccess {String} name Name of the Issue
 * @apiSuccess {String} description Description of the Issue
 * @apiSuccess {String=created,acknowledged,assigned,in_progress,solved,rejected} status Status of the Issue
 * @apiSuccess {Array} location Type of geometry and position
 * @apiSuccess {String=Point,LineString,Polygon,MultiPoint,MultilineString,MultiPolygon} location.type=point Type of GeoJSON objects
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
           "type": "statusChange",
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

router.put('/:id', findIssue, function (req, res, next) {
    issue = req.issue;

    issue.name = req.body.name;
    issue.description = req.body.description;
    issue.location[0] = req.body.location[0];
    issue.author = req.body.author;
    issue.assignedStaff = req.body.assignedStaff;
    issue.type = req.body.type;
    issue.tags = req.body.tags;

    issue.save(function (err, updatedIssue) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.send(updatedIssue);
    });
});

/**
 * @api {get} /issues/:id Read data of an Issue
 * @apiVersion 0.0.1
 * @apiName GetIssue
 * @apiGroup Issues
 * @apiPermission none
 *
 * @apiParam {String} _id Id of the Issue
 *
 * @apiSuccess {String} _id Id of the Issue
 * @apiSuccess {String} name Name of the Issue
 * @apiSuccess {String} description Description of the Issue
 * @apiSuccess {String=created,acknowledged,assigned,in_progress,solved,rejected} status Status of the Issue
 * @apiSuccess {Array} location Type of geometry and position
 * @apiSuccess {String=Point,LineString,Polygon,MultiPoint,MultilineString,MultiPolygon} location.type=point Type of GeoJSON objects
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
           "type": "statusChange",
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

router.get('/:id', findIssue, function (req, res, next) {
    res.send(req.issue);
});

/**
 * @api {get} /issues/ List and filter all Issues
 * @apiVersion 0.0.1
 * @apiName GetIssues
 * @apiGroup Issues
 * @apiPermission none
 *
 * @apiParam {String} [name] Filter by name of Issues
 * @apiParam {Array=created,acknowledged,assigned,in_progress,solved,rejected} [statusIs] Filter by indicated status of Issues
 * @apiParam {Array=created,acknowledged,assigned,in_progress,solved,rejected} [statusIsNot] Filter by status of Issues (inverted)
 * @apiParam {Date} [since] Filter by date of creation
 * @apiParam {Date} [until] Filter by date of creation
 * @apiParam {Number[]} [near] Filter by a region indicate by a point with coordinates
 * @apiParam {Number} [distance] Combinate with near and indicate the maximal distance of the region (from the indicated center)
 * @apiParam {String} [author] Filter by author of Issues
 * @apiParam {String} [assignedStaff] Filter by assignedStaff of Issues
 * @apiParam {String} [type] Filter by type of Issues
 *
 * @apiSuccess {String} _id Id of the Issue
 * @apiSuccess {String} name Name of the Issue
 * @apiSuccess {String} description Description of the Issue
 * @apiSuccess {String=created,acknowledged,assigned,in_progress,solved,rejected} status Status of the Issue
 * @apiSuccess {Array} location Type of geometry and position
 * @apiSuccess {String=Point,LineString,Polygon,MultiPoint,MultilineString,MultiPolygon} location.type=point Type of GeoJSON objects
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
           "type": "statusChange",
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

router.get('/', function (req, res, next) {

    var criteria = {};
    var sortcritera = 'name';

    //filter by name (in case of a duplicate name which is authorised by the model)
    if (req.query.name) {
        criteria.name = req.query.name;
    }
    //filter by statusIs
    if(req.query.statusIs){
      var statusIs = req.query.statusIs.split(',');
      criteria.status = {$in: statusIs };
    }
    //filter by statusIsNot
    if(req.query.statusIsNot){
      var statusIsNot = req.query.statusIsNot.split(',');
      criteria.status = {$nin: statusIsNot };
    }
    //filter by since and until date
    if(req.query.since && req.query.until){
      //A FAIRE !!!
       criteria.actions.createdAt = {
        $gte : new Date(req.query.since),
        $lte : new Date(req.query.until)
      };
    }else if(req.query.since){
      //A FAIRE !!!
       criteria.actions.createdAt = {
        $gte : new Date(req.query.since)
      };
    }else if(req.query.until){
      //A FAIRE !!!
       criteria.actions.createdAt = {
        $lte : new Date(req.query.until)
      };
    }
    //filter by near and distance
    if (typeof(req.query.near) == "object" && req.query.near.length) {
        //A TESTER + commenter distance en m, km ??? !!!
        var coordinates = req.query.near.split(',');
        var distance = 10;

        if (req.query.distance) {
          //parseInt param: String and Base 10
          distance = parseInt(req.query.distance, 10);
        }
        criteria.location = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [
                parseFloat(coordinates[0]),
                parseFloat(coordinates[1])
              ]
            },
            //mètres, km ???
            $maxDistance: distance
          }
        };
    }
    //filter by author
    if (req.query.author) {
        criteria.author = req.query.author;
    }
    //filter by assignedStaff
    if (req.query.assignedStaff) {
        criteria.assignedStaff = req.query.assignedStaff;
    }
    //filter by type
    if (req.query.type) {
        criteria.type = req.query.type;
    }

    Issue.find(criteria).sort(sortcritera).populate('action').exec(function (err, issues) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.send(issues);
    });

});

/**
 * @api {post} /issues/:id/comments Create a new Comment
 * @apiVersion 0.0.1
 * @apiName PostComment
 * @apiGroup Issues
 * @apiHeader {String} X-USERID Username.
 * @apiHeader {String} X-USERHASH Password hashed of the Username.
 * @apiPermission citizen
 *
 * @apiParam {String=comment} type Type of action - should be 'Comment'
 * @apiParam {String} content Description of the comment
 * @apiParam {String} author Author of the comment
 * @apiParam {Date} [createdAt] Date of the comment
 *
 * @apiSuccess {String=comment} type Type of action - should be 'Comment'
 * @apiSuccess {String} content Description of the comment
 * @apiSuccess {String} author Author of the comment
 * @apiSuccess {Date} [createdAt] Date of the comment
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
         "type": "comment",
         "content": "There is a mistake with the location...",
         "author": "joe",
         "createdAt": "2016-02-27T16:42:19.565Z",
         "_id": "56d1c54c77048d1005ea7417"
       }
  */

router.post('/:id/comments', toolsFYS.CheckCitizenAuthorization, findIssue, function (req, res, next) {
  if(req.body.type == 'comment'){
      issue = req.issue;
      issue.actions.push(req.body);

      issue.save(function (err, updatedIssue) {
          if (err) {
              res.status(500).send(err);
              return;
          }
          res.send(updatedIssue.actions[updatedIssue.actions.length -1]);
      });
  }else{
    res.status(400).send('Wrong action type');
    return;
  }
});

/**
 * @api {post} /issues/:id/statuschanges Create a new statusChange
 * @apiVersion 0.0.1
 * @apiName PoststatusChange
 * @apiGroup Issues
 * @apiHeader {String} X-USERID Username.
 * @apiHeader {String} X-USERHASH Password hashed of the Username.
 * @apiPermission staff
 *
 * @apiParam {String=statusChange} type Type of action - should be 'statusChange'
 * @apiParam {String} content New status of the issue
 * @apiParam {String} author Author of the status change
 * @apiParam {Date} [createdAt] Date of the status change
 *
 * @apiSuccess {String=statusChange} type Type of action - should be 'statusChange'
 * @apiSuccess {String} content Description of the status change
 * @apiSuccess {String} author Author of the status change
 * @apiSuccess {Date} [createdAt] Date of the status change
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
         "type": "statusChange",
         "content": "assigned",
         "author": "joe",
         "createdAt": "2016-02-27T16:42:19.565Z",
         "_id": "56d1c54c77048d1005ea7417"
       }
  */

router.post('/:id/statuschanges', toolsFYS.CheckStaffAuthorization, findIssue, function (req, res, next) {
  if(req.body.type == 'statusChange'){
    issue = req.issue;
    issue.actions.push(req.body);

    // Change the status in issue
    issue.status = req.body.content;

    // Check if the status is assigned and if the assignedstaff
    if (req.query.assignedStaff) {
        issue.status.assignedStaff = req.query.assignedStaff;
    }

    issue.save(function (err, updatedIssue) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.send(updatedIssue.actions[updatedIssue.actions.length -1]);
    });
  }else{
    res.status(400).send('Wrong action type');
    return;
  }
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
