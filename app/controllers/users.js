var express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        User = mongoose.model('User'),
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

router.post('/', toolsFYS.CheckAuthorization, function (req, res, next) {
    // Only allow Staff to add a user
    if (req.userRole == 'staff') {
        var user = new User(req.body);

        user.save(function (err, createdUser) {
            if (err) {
                res.status(500).send(err);
                return;
            }

            res.send(createdUser);
        });
    } else {
        res.status(403).send('User not authorized');
        return;
    }
});

router.put('/:id', toolsFYS.CheckAuthorization, function (req, res, next) {
    // Only allow Staff to update a user
    if (req.userRole == 'staff') {
        var userId = req.params.id;

        User.findById(userId, function (err, user) {
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

            user.save(function (err, updatedUser) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }

                res.send(updatedUser);
            });
        });
    } else {
        res.status(403).send('User not authorized');
        return;
    }
});

router.delete('/:id', function (req, res, next) {
    // Only allow Staff to delete a user
    if (req.userRole == 'staff') {
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
    } else {
        res.status(403).send('User not authorized');
        return;
    }
});

router.get('/:id', toolsFYS.CheckAuthorization, function (req, res, next) {

    var userId = req.params.id;

    User.findById(userId, function (err, user) {
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


router.get('/', function (req, res, next) {

    var userRole = req.query.role;

    User.where("role").equals(userRole).exec(function (err, users) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.send(users);
    });
});

//router.get('/api/v1/users', function (req, res, next) {
//
//    var userRole = req.params.role;
//
//    User.findStaff(userRole, function (err, user) {
//        if (err) {
//            res.status(500).send(err);
//            return;
//        } else if (!user) {
//            res.status(404).send('User not found');
//            return;
//        }
//
//        res.send(user);
//    });
//});
