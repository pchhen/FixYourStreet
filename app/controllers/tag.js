var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Tag = mongoose.model('Tag');

module.exports = function (app) {
  app.use('/api/v1/tags', router);
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

  var tag = new Tag(req.body);

  tag.save(function (err, createdTag) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.send(createdTag);
  });
});

// PUT /api/tags/:id
router.put('/:id', function (req, res, next) {

  var tagId = req.params.id;

  Tag.findById(tagId, function(err, tag) {
    if (err) {
      res.status(500).send(err);
      return;
    } else if (!tag) {
      res.status(404).send('Tag not found');
      return;
    }

    tag._id = req.body._id;
    tag.description = req.body.description;

    tag.save(function(err, updatedTag) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(updatedTag);
    });
  });
});
