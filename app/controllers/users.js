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

router.post('/', function (req, res, next) {

    var user = new User(req.body);

    user.save(function (err, createdUser) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.send(createdUser);
    });
});

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

router.get('/:id', toolsFYS.CheckStaffAuthorization, findUser, function (req, res, next) {
      res.send(user);
});

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

function findUser(req, res, next) {
  User.findById(req.params.id, function (err, type) {
      if (err) {
          res.status(500).send(err);
          return;
      } else if (!type) {
          res.status(404).send('User not found');
          return;
      }
      req.user = user;

      next();
  });
}
