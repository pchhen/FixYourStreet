var async = require('async'),
        express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        Issue = mongoose.model('Issue'),
        toolsFYS = require('toolsFYS');
var _ = require("underscore");

module.exports = function (app) {
    app.use('/api/v1/issues', router);
};

 /**
  * @api {post} /issues Create a new Issue
  * @apiVersion 1.0.0
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
  * @apiParam {String[]} [tags] Keywords describing the Issue
  * @apiParam {Object} actions List of actions - Comments and StatusChanges
  * @apiParam {String=comment,statusChange} actions.type Type of the action
  * @apiParam {String} actions.content Description for comment action or status for statusChange action
  * @apiParam {Date} [actions.createdAt=now] Date of the action (Iso format: yyyy-mm-ddThh:mm:ss.000Z, Time and Timezone can be omitted)
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
  * @apiSuccess {Object} actions List of actions - Comments and StatusChanges
  * @apiSuccess {String} actions.type Type of the action
  * @apiSuccess {String} actions.content Description for comment action or status for statusChange action
  * @apiSuccess {Date} actions.createdAt=now Date of the action (Iso format: yyyy-mm-ddThh:mm:ss.000Z)
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
            "createdAt": "2016-02-27T16:42:19.565Z"
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
 * @apiVersion 1.0.0
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
 * @apiSuccess {Object} actions List of actions - Comments and StatusChanges
 * @apiSuccess {String} actions.type Type of the action
 * @apiSuccess {String} actions.content Description for comment action or status for statusChange action
 * @apiSuccess {Date} actions.createdAt=now Date of the action (Iso format: yyyy-mm-ddThh:mm:ss.000Z)
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
           "createdAt": "2016-02-27T16:42:19.565Z"
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
 * @apiVersion 1.0.0
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
 * @apiSuccess {Object} actions List of actions - Comments and StatusChanges
 * @apiSuccess {String} actions.type Type of the action
 * @apiSuccess {String} actions.content Description for comment action or status for statusChange action
 * @apiSuccess {Date} actions.createdAt=now Date of the action (Iso format: yyyy-mm-ddThh:mm:ss.000Z)
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
           "createdAt": "2016-02-27T16:42:19.565Z"
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
 * @apiVersion 1.0.0
 * @apiName GetIssues
 * @apiGroup Issues
 * @apiPermission none
 *
 * @apiParam {String} [name] Filter by name of Issues
 * @apiParam {Array=created,acknowledged,assigned,in_progress,solved,rejected} [statusIs] Filter by indicated status of Issues
 * @apiParam {Array=created,acknowledged,assigned,in_progress,solved,rejected} [statusIsNot] Filter by status of Issues (inverted)
 * @apiParam (Parameter Date){Date} [dateSince] Filter by date (Iso format: yyyy-mm-ddThh:mm:ss.000Z, Time and Timezone can be omitted)
 * @apiParam (Parameter Date){Date} [dateUntil] Filter by date (Iso format: yyyy-mm-ddThh:mm:ss.000Z, Time and Timezone can be omitted)
 * @apiParam (Parameter Date){Date} [dateStatusIs=$statusIs] Filter by date of a certain status - required for a date if statutIs is not defined
 * @apiParam (Parameter Region){Number[]} [near] Filter by a region indicate by a point with coordinates
 * @apiParam (Parameter Region){Number} [distance=1000] Combinate with near and indicate the maximal distance (in meter) of the region (from the indicated center)
 * @apiParam {String} [author] Filter by author of Issues
 * @apiParam {String} [assignedStaff] Filter by assignedStaff of Issues
 * @apiParam {String} [type] Filter by type of Issues
 * @apiParam (Parameter Pagination){String} [page=1] Actual page number
 * @apiParam (Parameter Pagination){String} [pageSize=30] Number of Issues per page
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
 * @apiSuccess {Object} actions List of actions - Comments and StatusChanges
 * @apiSuccess {String} actions.type Type of the action
 * @apiSuccess {String} actions.content Description for comment action or status for statusChange action
 * @apiSuccess {Date} actions.createdAt=now Date of the action (Iso format: yyyy-mm-ddThh:mm:ss.000Z)
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
           "createdAt": "2016-02-27T16:42:19.565Z"
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

    // Filter Pagination
    var page = req.query.page ? parseInt(req.query.page, 10) : 1,
        pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 30;

    // Convert page and page size to offset and limit.
    var offset = (page - 1) * pageSize,
        limit = pageSize;

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
    //filter by Date
    if(req.query.dateSince || req.query.dateUntil){

      //Work only if status is defined (either with dateStatusIs or statusIs)
      if(req.query.dateStatusIs){
        dateStatusIs = req.query.dateStatusIs.split(',');
      }else if(req.query.statusIs){
        dateStatusIs = req.query.statusIs.split(',');
      }else{
        res.status(400).send('Date filter require a status');
        return;
      }

      if(req.query.dateSince && req.query.dateUntil){
        datefilter = {$gte : new Date(req.query.dateSince ),$lte : new Date(req.query.dateUntil)};
      }else if(req.query.dateSince){
        datefilter = {$gte : new Date(req.query.dateSince )};
      }else if(req.query.dateUntil){
        datefilter = {$lte : new Date(req.query.dateUntil)};
      }

       criteria.actions = {
         "$elemMatch": {
           "content": {$in: dateStatusIs },
           "createdAt":datefilter
        }
      };
    }

    //filter by near and distance
    if (req.query.near) {
        var coordinates = req.query.near.split(',');
        var distance = 1000; //Distance in meters, default is 1 km

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
            //Distance in meters
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

    // Count all issues (without filters).
    function countAllIssues(callback) {
      Issue.count(function(err, totalCount) {
        if (err) {
          callback(err);
        } else {
          callback(undefined, totalCount);
        }
      });
    }

    // Count issues matching the filters.
    function countFilteredIssues(callback) {
      Issue.count(criteria, function(err, filteredCount) {
        if (err) {
          callback(err);
        } else {
          callback(undefined, filteredCount);
        }
      });
    }

    // Find issues matching the filters.
    function findMatchingIssues(callback) {

      var query = Issue
        .find(criteria)
        // Do not forget to sort, as pagination makes more sense with sorting.
        .sort(sortcritera)
        .populate('action')
        .skip(offset)
        .limit(limit);

      // Execute the query.
      query.exec(function(err, issues) {
        if (err) {
          callback(err);
        } else {
          callback(undefined, issues);
        }
      });
    }

    // Set the pagination headers and send the matching issues in the body.
    function sendResponse(err, results) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      var totalCount = results[0],
          filteredCount = results[1],
          issues = results[2];

      // Return the pagination data in headers.
      res.set('X-Pagination-Page', page);
      res.set('X-Pagination-Page-Size', pageSize);
      res.set('X-Pagination-Total', totalCount);
      res.set('X-Pagination-Filtered-Total', filteredCount);

      res.send(issues);
    }

    async.parallel([
      countAllIssues,
      countFilteredIssues,
      findMatchingIssues
    ], sendResponse);
  });

/**
 * @api {post} /issues/:id/actions/comments Create a new Comment
 * @apiVersion 1.0.0
 * @apiName PostComment
 * @apiGroup Issues Actions
 * @apiHeader {String} X-USERID Username.
 * @apiHeader {String} X-USERHASH Password hashed of the Username.
 * @apiPermission citizen
 *
 * @apiParam {String=comment} type Type of Action
 * @apiParam {String} content Description of the comment
 * @apiParam {String} author Author of the comment
 * @apiParam {Date} [createdAt=now] Date of the comment (Iso format: yyyy-mm-ddThh:mm:ss.000Z, Time and Timezone can be omitted)
 *
 * @apiSuccess {String=comment} type Type of action
 * @apiSuccess {String} content Description of the comment
 * @apiSuccess {String} author Author of the comment
 * @apiSuccess {Date} createdAt=now Date of the comment (Iso format: yyyy-mm-ddThh:mm:ss.000Z)
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
         "type": "comment",
         "content": "There is a mistake with the location...",
         "author": "joe",
         "createdAt": "2016-02-27T16:42:19.565Z"
       }
  */

router.post('/:id/actions/comments', toolsFYS.CheckCitizenAuthorization, findIssue, function (req, res, next) {
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
 * @api {post} /issues/:id/actions/statusChanges Create a new statusChange
 * @apiVersion 1.0.0
 * @apiName PoststatusChange
 * @apiGroup Issues Actions
 * @apiHeader {String} X-USERID Username.
 * @apiHeader {String} X-USERHASH Password hashed of the Username.
 * @apiPermission staff
 *
 * @apiParam {String=statusChange} type Type of Action
 * @apiParam {String} content New status of the Issue
 * @apiParam {String} author Author of the status change
 * @apiParam {Date} [createdAt=now] Date of the status change (Iso format: yyyy-mm-ddThh:mm:ss.000Z, Time and Timezone can be omitted)
 *
 * @apiSuccess {String=statusChange} type Type of action
 * @apiSuccess {String} content Description of the status change
 * @apiSuccess {String} author Author of the status change
 * @apiSuccess {Date} createdAt=now Date of the status change (Iso format: yyyy-mm-ddThh:mm:ss.000Z)
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
         "type": "statusChange",
         "content": "assigned",
         "author": "joe",
         "createdAt": "2016-02-27T16:42:19.565Z"
       }
  */

router.post('/:id/actions/statusChanges', toolsFYS.CheckStaffAuthorization, findIssue, function (req, res, next) {
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
 * @api {get} /issues/:id/actions List all Actions of an Issue
 * @apiVersion 1.0.0
 * @apiName GetActions
 * @apiGroup Issues Actions
 * @apiPermission none
 *
 * @apiParam {String} _id Id of the Issue
 *
 * @apiSuccess {String=statusChange,comment} type Type of Action
 * @apiSuccess {String} content Description or Status of the Action
 * @apiSuccess {String} author Author of the Action
 * @apiSuccess {Date} createdAt=now Date of the Action (Iso format: yyyy-mm-ddThh:mm:ss.000Z)
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *   {
      "type": "statusChange",
      "content": "in_progress",
      "author": "patrick",
      "createdAt": "2016-01-01T08:30:00.000Z"
    },
    {
      "type": "comment",
      "content": "The place is now cleaned and the new bin will bin installed tommorow",
      "author": "patrick",
      "createdAt": "2016-01-03T15:30:00.000Z"
    }
  */

router.get('/:id/actions', findIssue, function (req, res, next) {
    res.send(req.issue.actions);
});

/**
 * @api {get} /issues/:id/actions/statusChanges List all StatusChanges of an Issue
 * @apiVersion 1.0.0
 * @apiName GetStatusChanges
 * @apiGroup Issues Actions
 * @apiPermission none
 *
 * @apiParam {String} _id Id of the Issue
 *
 * @apiSuccess {String=statusChange} type Type of Action
 * @apiSuccess {String} content Status of the Action
 * @apiSuccess {String} author Author of the Action
 * @apiSuccess {Date} createdAt=now Date of the Action (Iso format: yyyy-mm-ddThh:mm:ss.000Z)
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *   {
      "type": "statusChange",
      "content": "in_progress",
      "author": "patrick",
      "createdAt": "2016-01-01T08:30:00.000Z"
    }
  */

router.get('/:id/actions/statusChanges', findIssue, function (req, res, next) {
    res.send(_.where(req.issue.actions, {type: "statusChange"}));
});

/**
 * @api {get} /issues/:id/actions/comments List all Comments of an Issue
 * @apiVersion 1.0.0
 * @apiName GetComments
 * @apiGroup Issues Actions
 * @apiPermission none
 *
 * @apiParam {String} _id Id of the Issue
 *
 * @apiSuccess {String=comment} type Type of Action
 * @apiSuccess {String} content Description of the Action
 * @apiSuccess {String} author Author of the Action
 * @apiSuccess {Date} createdAt=now Date of the Action (Iso format: yyyy-mm-ddThh:mm:ss.000Z)
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *   {
      "type": "comment",
      "content": "The place is now cleaned and the new bin will be installed tommorow",
      "author": "patrick",
      "createdAt": "2016-01-03T15:30:00.000Z"
    }
  */

router.get('/:id/actions/comments', findIssue, function (req, res, next) {
    res.send(_.where(req.issue.actions, {type: "comment"}));
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
