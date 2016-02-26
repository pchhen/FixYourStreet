var express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        Type = mongoose.model('Type'),
        toolsFYS = require('toolsFYS');

module.exports = function (app) {
    app.use('/api/v1/types', router);
};

router.post('/', toolsFYS.CheckAuthorization, function (req, res, next) {
    // Only allow Staff to add a tag
    if (req.userRole == 'staff') {
        var type = new Type(req.body);

        type.save(function (err, createdType) {
            if (err) {
                res.status(500).send(err);
                return;
            }

            res.send(createdType);
        });
    } else {
        res.status(401).send('User not authorized');
        return;
    }
});

router.put('/:id', toolsFYS.CheckAuthorization, function (req, res, next) {
    // Only allow Staff to update a tag
    if (req.userRole == 'staff') {
        var typeId = req.params.id;

        Type.findById(typeId, function (err, type) {
            if (err) {
                res.status(500).send(err);
                return;
            } else if (!type) {
                res.status(404).send('No Type found');
                return;
            }

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
    } else {
        res.status(401).send('User not authorized');
        return;
    }
});


router.delete('/:id', toolsFYS.CheckAuthorization, function (req, res, next) {
    // Only allow Staff to delete a tag
    if (req.userRole == 'staff') {
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
    } else {
        res.status(401).send('User not authorized');
        return;
    }
});


router.get('/', toolsFYS.CheckAuthorization, function (req, res, next) {
    // Only allow Staff to delete a tag
    if (req.userRole == 'staff') {
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
    } else {
        res.status(401).send('User not authorized');
        return;
    }
});


router.get('/:id', toolsFYS.CheckAuthorization, function (req, res, next) {
    // Only allow Staff to delete a tag
    if (req.userRole == 'staff') {
        var typeId = req.params.id;

        Type.findById(typeId, function (err, type) {
            if (err) {
                res.status(500).send(err);
                return;
            } else if (!type) {
                res.status(404).send('Type not found');
                return;
            }

            res.send(type);
        });
    } else {
        res.status(401).send('User not authorized');
        return;
    }
});
