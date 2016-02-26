var express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        Type = mongoose.model('Type'),
        toolsFYS = require('toolsFYS');

module.exports = function (app) {
    app.use('/api/v1/types', router);
};

router.post('/', toolsFYS.CheckStaffAuthorization, function (req, res, next) {
      var type = new Type(req.body);

      type.save(function (err, createdType) {
          if (err) {
              res.status(500).send(err);
              return;
          }

          res.send(createdType);
      });
});

router.put('/:id', toolsFYS.CheckStaffAuthorization, findType, function (req, res, next) {
      type._id = req.body._id;
      type.description = req.body.description;

      type.save(function (err, updatedType) {
          if (err) {
              res.status(500).send(err);
              return;
          }

          res.send(updatedType);
      });
});


router.delete('/:id', toolsFYS.CheckStaffAuthorization, function (req, res, next) {
      var typeId = req.params.id;

      Type.remove({
          _id: typeId
      }, function (err, data) {
          if (err) {
              res.status(500).send(err);
              return;
          }

          console.log('Deleted ' + data + ' documents');
          res.sendStatus(204);
      });
});


router.get('/', toolsFYS.CheckStaffAuthorization, function (req, res, next) {
    Type.find(function (err, types) {
        if (err) {
            res.status(500).send(err);
            return;
        }else if (!types.length) {
            res.status(404).send('No Type found');
            return;
        }

        res.send(types);
    });
});


router.get('/:id', toolsFYS.CheckStaffAuthorization, findType, function (req, res, next) {
    res.send(type);
});

/**
 * Middleware that finds the type corresponding to the :id URL parameter
 * and stores it in `req.type`.
 */
function findType(req, res, next) {
  Type.findById(req.params.id, function (err, type) {
      if (err) {
          res.status(500).send(err);
          return;
      } else if (!type) {
          res.status(404).send('Type not found');
          return;
      }
      req.type = type;

      next();
  });
}
