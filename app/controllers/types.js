var express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        Type = mongoose.model('Type'),
        toolsFYS = require('toolsFYS');

module.exports = function (app) {
    app.use('/api/v1/types', router);
};

/**
 * @api {post} /types Create a new type
 * @apiVersion 0.0.1
 * @apiName PostType
 * @apiGroup Type
 * @apiHeader {String} X-USERID Username.
 * @apiHeader {String} X-USERHASH Password hashed of the Username.
 * @apiPermission staff
 *
 * @apiParam {String} _id Name of the Type.
 * @apiParam {String} description Description of the Type.
 *
 * @apiSuccess {String} _id Name of the Type.
 * @apiSuccess {String} description  Description of the Type.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "streetlight",
 *       "description": "A raised source of light on the edge of a road or walkway."
 *     }
 */

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

/**
 * @api {put} /types/:id Update a type
 * @apiVersion 0.0.1
 * @apiName PutType
 * @apiGroup Type
 * @apiHeader {String} X-USERID Username.
 * @apiHeader {String} X-USERHASH Password hashed of the Username.
 * @apiPermission staff
 *
 * @apiParam {String} [_id] Name of the Type.
 * @apiParam {String} [description] Description of the Type.
 *
 * @apiSuccess {String} _id Name of the Type.
 * @apiSuccess {String} description  Description of the Type.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "streetlight",
 *       "description": "A raised source of light on the edge of a road or walkway."
 *     }
 */

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

/**
 * @api {delete} /types/:id Delete a type
 * @apiVersion 0.0.1
 * @apiName DeleteType
 * @apiGroup Type
 * @apiHeader {String} X-USERID Username.
 * @apiHeader {String} X-USERHASH Password hashed of the Username.
 * @apiPermission staff
 *
 * @apiParam {String} _id Name of the Type.
 *
 * @apiSuccessExample {json} Success example
 * HTTP/1.1 204 No Content
 */

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

/**
 * @api {get} /types/ List all types
 * @apiVersion 0.0.1
 * @apiName GetTypes
 * @apiGroup Type
 * @apiPermission none
 *
 * @apiSuccess {String} _id Name of the Type.
 * @apiSuccess {String} description  Description of the Type.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "streetlight",
 *       "description": "A raised source of light on the edge of a road or walkway."
 *     }
 */

router.get('/', function (req, res, next) {
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

/**
 * @api {get} /types/:id Read data of a type
 * @apiVersion 0.0.1
 * @apiName GetType
 * @apiGroup Type
 * @apiPermission none
 *
 * @apiParam {String} _id Name of the Type.
 *
 * @apiSuccess {String} _id Name of the Type.
 * @apiSuccess {String} description  Description of the Type.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "streetlight",
 *       "description": "A raised source of light on the edge of a road or walkway."
 *     }
 */

router.get('/:id', findType, function (req, res, next) {
    res.send(req.type);
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
