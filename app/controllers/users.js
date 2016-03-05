var express = require('express'),
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
 * @apiVersion 1.0.0
 * @apiName PostCitizen
 * @apiGroup Users
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
 *       "_id": "alain",
 *       "role": "citizen",
 *       "password": "password"
 *     }
 */

router.post('/citizen', function (req, res, next) {

    var user = new User(req.body);
    user.role = 'citizen';

    //**Need a hashfunction for the password (for future improvement)

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
 * @apiVersion 1.0.0
 * @apiName PostStaff
 * @apiGroup Users
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

    //**Need a hashfunction for the password (for future improvement)

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
 * @apiVersion 1.0.0
 * @apiName PutUser
 * @apiGroup Users
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
 * @apiVersion 1.0.0
 * @apiName DeleteUser
 * @apiGroup Users
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
 * @apiVersion 1.0.0
 * @apiName GetUser
 * @apiGroup Users
 * @apiHeader {String} X-USERID Username.
 * @apiHeader {String} X-USERHASH Password hashed of the Username.
 * @apiPermission citizen
 *
 * @apiParam {String} _id Name of the User.
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
 * @api {get} /users List all Users
 * @apiVersion 1.0.0
 * @apiName GetUsers
 * @apiGroup Users
 * @apiHeader {String} X-USERID Username.
 * @apiHeader {String} X-USERHASH Password hashed of the Username.
 * @apiPermission staff
 *
 * @apiParam {String} [role] Role of the User (Note: doesn't work combined with "Parameter Group by")
 *
 * @apiParam (Parameter Group by){String} [issueStatusIs] Filter by Issue status set by a user
 * @apiParam (Parameter Group by){String} [issueStatusIsNot] Filter by Issue status not set by a user
 * @apiParam (Parameter Group by){boolean} [assignedStaff] Filter by Issue status set by an assigned user
 * @apiParam (Parameter Group by){String=leastFirst,mostFirst} [order="mostFirst"] ASCending or DESCending order
 *
 * @apiSuccess {String} _id Name of the User.
 * @apiSuccess {String} role Role of the User.
 * @apiSuccess {String} password Password of the User.
 *
 * @apiSuccess (Group by Success 200) {String} _id Name of the User.
 * @apiSuccess (Group by Success 200) {String} total Total of Issue by user
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "joe",
 *       "role": "citizen",
 *       "password": "password"
 *     }
 *
 * @apiSuccessExample Group by Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "joe",
 *       "total": "2",
 *     }
 */

router.get('/', toolsFYS.CheckStaffAuthorization, function (req, res, next) {
      var issueOrder = -1;
      var criteriaUser = {};
      var criteriaActions = {};
      var criteriaAssigned = {};

      //filter by Aggregation of users
      if(req.query.issueStatusIs || req.query.issueStatusIsNot){

        //filter by statusIs
        if(req.query.issueStatusIs){
          var IssueStatusIs = req.query.issueStatusIs.split(',');
          //content contained the status in the subdocument actions
          criteriaActions = {"actions.content":{$in: IssueStatusIs }};
        }
        //filter by statusIsNot
        if(req.query.issueStatusIsNot){
          var IssueStatusIsNot = req.query.issueStatusIsNot.split(',');
          //content contained the status in the subdocument actions
          criteriaActions = {status:{$nin: IssueStatusIsNot }};
        }
        // Filter order
        if(req.query.order == 'leastFirst'){
          issueOrder = 1;
        }
        // Filter assignedStaff
        if(req.query.assignedStaff){
          criteriaAssigned = {cmp_value: {$eq:true}};
        }

        Issue.aggregate([
          { // Make a document for each actions
            $unwind:'$actions'
          },
          { // Match the status criteria
            $match: criteriaActions
          },
          { // Filter assignedStaff - Used to compare if the author of the status is also the assignedStaff
            $project: {
              _id: '$actions.author',
              cmp_value: {$eq: ['$assignedStaff', '$actions.author']},
              total: { $sum: 1 }
            }
          },
          { // Filter assignedStaff - Remove object when the author of the status is not the assignedStaff
            $match: criteriaAssigned
          },
          { // Group by _id of the $project -> author
            $group: {
              _id: '$_id',
              total: { $sum: 1 }
            }
          },
          {
            $sort: { total: issueOrder }
          }
        ], function(err, resultsUsersAgg) {
          if (err) {
            res.status(500).send(err);
            return;
          }
          res.send(resultsUsersAgg);
        });

      }else{

        // Filter by role
        if (req.query.role) {
            criteriaUser.role = req.query.role;
        }

        User.find((criteriaUser)).sort('_id').exec(function (err, users) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.send(users);
        });
      }
});

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
