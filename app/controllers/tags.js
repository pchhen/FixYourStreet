var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Tag = mongoose.model('Tag'),
  User = mongoose.model('User');

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

router.post('/', CheckAuthorization,function (req, res, next) {

    var tag = new Tag(req.body);

    tag.save(function (err, createdTag) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(createdTag);
    });
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

/**
 * @api {delete} /tags/:id Delete a tag
 * @apiName DeleteTag
 * @apiGroup Tag
 *
 * @apiSuccess {String} id Name of the Tag
 */

 router.delete('/:id', function (req, res, next) {

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
});

// Check if the user has the authorization
function CheckAuthorization(req, res, next){
  var criteria = {};
  criteria._id = req.get("X-USERID");
  criteria.password = req.get("X-USERHASH");
  /*
  User.findById(req.get("X-USERID"), function(err, book) {
    if (err) {
      res.status(500).send(err);
      return;
    } else if (!book) {
      res.status(404).send('Book not found');
      return;
    }
    console.log(book);
  req.book = book;
  next();
  });
  */
  User.find(criteria)
  .exec(function(err, user) {
    if (err) {
      res.status(403).send(err);
      return;
    }
    if(!user.length){
      res.status(403).send('User is undefined');
      return;
    }

    res.user = user;
    console.log(user);
    next();
  });
}
