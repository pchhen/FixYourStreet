var async = require('async'),
        express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        User = mongoose.model('User'),
        Issue = mongoose.model('Issue'),
        toolsFYS = require('toolsFYS');

module.exports = function (app) {
    app.use('/api/v1/users', router);
};

/**
 * @api {post} /users/citizen Create a new Citizen
 * @apiVersion 0.0.1
 * @apiName PostCitizen
 * @apiGroup User
 * @apiPermission none
 *
 * @apiParam {String} _id Name of the User.
 * @apiParam {String} password Password of the User.
 *
 * @apiSuccess {String} _id Name of the User.
 * @apiSuccess {String} role Role of the User.
 * @apiSuccess {String} password Password of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "jim",
 *       "role": "citizen",
 *       "password": "password"
 *     }
 */

router.post('/citizen', function (req, res, next) {

    var user = new User(req.body);
    user.role = 'citizen';

    //**Need a hashfunction for the password

    user.save(function (err, createdUser) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.send(createdUser);
    });
});

/**
 * @api {post} /users/staff Create a new Staff
 * @apiVersion 0.0.1
 * @apiName PostStaff
 * @apiGroup User
 * @apiHeader {String} X-USERID Username.
 * @apiHeader {String} X-USERHASH Password hashed of the Username.
 * @apiPermission staff
 *
 * @apiParam {String} _id Name of the User.
 * @apiParam {String} password Password of the User.
 *
 * @apiSuccess {String} _id Name of the User.
 * @apiSuccess {String} role Role of the User.
 * @apiSuccess {String} password Password of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "arnold",
 *       "role": "staff",
 *       "password": "password"
 *     }
 */

router.post('/staff', toolsFYS.CheckStaffAuthorization, function (req, res, next) {

    var user = new User(req.body);
    user.role = 'staff';

    //**Need a hashfunction for the password

    user.save(function (err, createdUser) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.send(createdUser);
    });
});

/**
 * @api {put} /users/:id Update a User
 * @apiVersion 0.0.1
 * @apiName PutUser
 * @apiGroup User
 * @apiHeader {String} X-USERID Username.
 * @apiHeader {String} X-USERHASH Password hashed of the Username.
 * @apiPermission staff
 *
 * @apiParam {String} _id Name of the User.
 * @apiParam {String=staff,citizen} [role] Role of the User.
 * @apiParam {String} [password] Password of the User.
 *
 * @apiSuccess {String} _id Name of the User.
 * @apiSuccess {String} role Role of the User.
 * @apiSuccess {String} password Password of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "arnold",
 *       "role": "staff",
 *       "password": "password"
 *     }
 */

router.put('/:id', toolsFYS.CheckStaffAuthorization, findUser, function (req, res, next) {
    user._id = req.body._id;
    user.role = req.body.role;
    user.password = req.body.password;

    user.save(function (err, updatedUser) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.send(updatedUser);
    });
});

/**
 * @api {delete} /users/:id Delete a User
 * @apiVersion 0.0.1
 * @apiName DeleteUser
 * @apiGroup User
 * @apiHeader {String} X-USERID Username.
 * @apiHeader {String} X-USERHASH Password hashed of the Username.
 * @apiPermission staff
 *
 * @apiParam {String} _id Name of the User.
 *
 * @apiSuccessExample {json} Success example
 * HTTP/1.1 204 No Content
 */

router.delete('/:id', function (req, res, next) {
    var userId = req.params.id;

    User.remove({
        _id: userId
    }, function (err, data) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.send(updatedUser);


        console.log('Deleted ' + data + ' documents');
        res.sendStatus(204);

    });
});

/**
 * @api {get} /users/:id Read data of a user
 * @apiVersion 0.0.1
 * @apiName GetUser
 * @apiGroup User
 * @apiPermission none
 *
 * @apiParam {String} _id Name of the Type.
 *
 * @apiSuccess {String} _id Name of the User.
 * @apiSuccess {String} role Role of the User.
 * @apiSuccess {String} password Password of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "joe",
 *       "role": "citizen",
 *       "password": "password"
 *     }
 */

router.get('/:id', toolsFYS.CheckCitizenAuthorization, findUser, function (req, res, next) {
      res.send(req.user);
});

/**
 * @api {get} /users/ List all Users
 * @apiVersion 0.0.1
 * @apiName GetUsers
 * @apiGroup User
 * @apiHeader {String} X-USERID Username.
 * @apiHeader {String} X-USERHASH Password hashed of the Username.
 * @apiPermission staff
 *
 * @apiParam {String} [issueStatusIs] Filter by Issue status set by a user
 * @apiParam {String} [issueStatusIsNot] Filter by Issue status not set by a user
 * @apiParam {String} [page=1] Actual page number
 * @apiParam {String} [pageSize=30] Numbers of user per page
 * @apiParam {String=leastFirst,mostFirst} [order="mostFirst"] Ascending or descending order
 *
 * @apiSuccess {String} _id Name of the User.
 * @apiSuccess {String} role Role of the User.
 * @apiSuccess {String} password Password of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "joe",
 *       "role": "citizen",
 *       "password": "password"
 *     }
 */

router.get('/', toolsFYS.CheckStaffAuthorization, function (req, res, next) {
      // Get page and page size for pagination.
      var page = req.query.page ? parseInt(req.query.page, 10) : 1,
          pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 30;

      // Convert page and page size to offset and limit.
      var offset = (page - 1) * pageSize,
          limit = pageSize;

      var issueOrder = -1;

      var criteriaUser = {};
      var criteriaIssue = {};

      // Filter by role
      if (req.query.role) {
          criteriaUser.role = req.query.role;
      }

      // Filter by status issues (aggregation with issue)
      if(req.query.issueStatusIs || req.query.issueStatusIsNot){
        // Complex filter by issue status with boolean operator
        if ((typeof(req.query.issueStatusIs) == "object" && req.query.issueStatusIs.length) || (typeof(req.query.issueStatusIsNot) == "object" && req.query.issueStatusIsNot.length)) {

        }// Filter by status
        else if (req.query.issueStatusIs){
           criteriaIssue.status = req.query.issueStatusIs;
        }// Filter by status is not simple
        else if (req.query.issueStatusIsNot){
          criteriaIssue.status = {$nin: [req.query.issueStatusIsNot]};
        }
      }

      if(req.query.order == 'leastFirst'){
        issueOrder = 1;
      }


        Issue.aggregate([
          {
            $match: criteriaIssue
          },
          {
            $group: {
              _id: '$author',
              total: { $sum: 1 }
            }
          },
          {
            $sort: { total: issueOrder }
          },
          {
            $skip: offset
          },
          {
            $limit: limit
          }
        ], function(err, usersCounts) {
          if (err) {
            res.status(500).send(err);
            return;
          }
          console.log(usersCounts);
          //callback(undefined, usersCounts);


        });


      // Count all users (without filters).
      countAllUsers = function (callback) {
        User.count(function(err, totalCount) {
          if (err) {
            callback(err);
          } else {
            callback(undefined, totalCount);
          }
        });
      };

      // Count books matching the filters.
      countFilteredUsers = function (callback) {
        User.count(criteriaUser, function(err, filteredCount) {
          if (err) {
            callback(err);
          } else {
            callback(undefined, filteredCount);
          }
        });
      };

      // Find books matching the filters.
      findMatchingUsers = function (callback) {

        var query = User
          .find(criteriaUser)
          // Do not forget to sort, as pagination makes more sense with sorting.
          .sort('_id')
          .skip(offset)
          .limit(limit);

          //query = query.populate('_id');


        // Execute the query.
        query.exec(function(err, users) {
          if (err) {
            callback(err);
          } else {
            callback(undefined, users);
          }
        });
      };

      // Set the pagination headers and send the matching books in the body.
      sendResponse = function (err, results) {
        if (err) {
          res.status(500).send(err);
          return;
        }

        var totalCount = results[0],
            filteredCount = results[1],
            users = results[2];

        // Return the pagination data in headers.
        res.set('X-Pagination-Page', page);
        res.set('X-Pagination-Page-Size', pageSize);
        res.set('X-Pagination-Total', totalCount);
        res.set('X-Pagination-Filtered-Total', filteredCount);

        res.send(users);
      };

    async.parallel([
      countAllUsers,
      countFilteredUsers,
      findMatchingUsers
    ], sendResponse);
});
/*
function GroupUsersByIssues (criteria, order, offset, limit, callback){
  Issue.aggregate([
    {
      $match: criteria
    },
    {
      $group: {
        _id: '$author',
        total: { $sum: 1 }
      }
    },
    {
      $sort: { total: order }
    },
    {
      $skip: offset
    },
    {
      $limit: limit
    }
  ], function(err, usersCounts) {
    if (err) {
      res.status(500).send(err);
      return;
    }
    callback(undefined, usersCounts);

  });
}*/

/**
 * Middleware that finds the user corresponding to the :id URL parameter
 * and stores it in `req.user`.
 */

function findUser(req, res, next) {
  User.findById(req.params.id, function (err, user) {
      if (err) {
          res.status(500).send(err);
          return;
      } else if (!user) {
          res.status(404).send('User not found');
          return;
      }
      req.user = user;


      next();
  });
}
