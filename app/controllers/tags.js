var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Tag = mongoose.model('Tag'),
  toolsFYS = require('toolsFYS');

module.exports = function (app) {
  app.use('/api/v1/tags', router);
};


/**
 * @api {post} /tags/ Create a tag
 * @apiName PostTag
 * @apiGroup Tag
 *
 * @apiParam {String} id Unique name of the Tag.
 * @apiParam {String} description  Description of the Tag.
 *
 * @apiSuccess {String} id Name of the Tag
 * @apiSuccess {String} description  Description of the Tag.
 */

router.post('/',toolsFYS.CheckAuthorization, function (req, res, next) {
    // Only allow Staff to add a tag
    if(req.userRole == 'staff'){
      var tag = new Tag(req.body);

      tag.save(function (err, createdTag) {
        if (err) {
          res.status(500).send(err);
          return;
        }

        res.send(createdTag);
      });
    }else{
      res.status(403).send('User not authorized');
      return;
    }
});

/**
 * @api {put} /tags/:id Update a tag
 * @apiName PutTag
 * @apiGroup Tag
 *
 * @apiParam {String} id Unique name of the Tag.
 * @apiParam {String} description  Description of the Tag.
 *
 * @apiSuccess {String} id Name of the Tag
 * @apiSuccess {String} description  Description of the Tag.
 */

router.put('/:id',toolsFYS.CheckAuthorization, function (req, res, next) {
  // Only allow Staff to update a tag
  if(req.userRole == 'staff'){
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
  }else{
    res.status(403).send('User not authorized');
    return;
  }
});

/**
 * @api {delete} /tags/:id Delete a tag
 * @apiName DeleteTag
 * @apiGroup Tag
 *
 * @apiSuccess {String} id Name of the Tag
 */

 router.delete('/:id',toolsFYS.CheckAuthorization, function (req, res, next) {
  // Only allow Staff to delete a tag
  if(req.userRole == 'staff'){
    var tagId = req.params.id;

    Person.remove({
      _id: tagId
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
