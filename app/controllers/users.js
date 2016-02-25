var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  toolsFYS = require('toolsFYS');

module.exports = function (app) {
  app.use('/api/v1/users', router);
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

router.post('/',toolsFYS.CheckAuthorization, function (req, res, next) {
  // Only allow Staff to add a user
  if(req.userRole == 'staff'){
    var user = new User(req.body);

    user.save(function (err, createdUser) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(createdUser);
    });
  }else{
    res.status(403).send('User not authorized');
    return;
  }
});

// PUT /api/tags/:id
router.put('/:id',toolsFYS.CheckAuthorization, function (req, res, next) {
  // Only allow Staff to update a user
  if(req.userRole == 'staff'){
    var userId = req.params.id;

    User.findById(userId, function(err, user) {
      if (err) {
        res.status(500).send(err);
        return;
      } else if (!user) {
        res.status(404).send('User not found');
        return;
      }

      user._id = req.body._id;
      user.role = req.body.role;
      user.password = req.body.password;

      user.save(function(err, updatedUser) {
        if (err) {
          res.status(500).send(err);
          return;
        }

        res.send(updatedUser);
      });
    });
  }else{
    res.status(403).send('User not authorized');
    return;
  }
});

router.delete('/:id', function (req, res, next) {
  // Only allow Staff to delete a user
  if(req.userRole == 'staff'){
    var userId = req.params.id;

    User.remove({
      _id: userId
    }, function(err, data) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      console.log('Deleted ' + data + ' documents');
      res.sendStatus(204);
    });
  }else{
    res.status(403).send('User not authorized');
    return;
  }
});

router.get('/:id',toolsFYS.CheckAuthorization, function (req, res, next) {

  var userId = req.params.id;

  User.findById(userId, function(err, user) {
    if (err) {
      res.status(500).send(err);
      return;
    } else if (!user) {
      res.status(404).send('User not found');
      return;
    }

    res.send(user);
  });
});


router.get('/api/v1/users?role=staff', function (req, res, next) {

  var userRole = req.params.role;

  User.findStaff(userRole, function(err, user) {
    if (err) {
      res.status(500).send(err);
      return;
    } else if (!user) {
      res.status(404).send('User not found');
      return;
    }

    res.send(user);
  });
});
