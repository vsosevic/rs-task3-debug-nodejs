const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');

const User = require('../db').import('../models/user.model');

router.post('/signup', (req, res) => {
    User.create({
        full_name: req.body.user.full_name,
        username: req.body.user.username,
        passwordHash: bcrypt.hashSync(req.body.user.password, 10),
        email: req.body.user.email,
    })
        .then(
            function signupSuccess(user) {
                const token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
                res.status(StatusCodes.OK).json({
                    user: user,
                    token: token
                })
            },

            function signupFail(err) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message)
            }
        ).catch(err => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
    });
});

router.post('/signin', (req, res) => {
    User.findOne({ where: { username: req.body.user.username } }).then(user => {
        if (user) {
            bcrypt.compare(req.body.user.password, user.passwordHash, function (err, matches) {
                if (matches) {
                    const token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
                    res.json({
                        user: user,
                        message: "Successfully authenticated.",
                        sessionToken: token
                    });
                } else {
                    res.status(StatusCodes.NOT_ACCEPTABLE).send({ error: "Passwords do not match." })
                }
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).send({ error: "User not found." })
        }
    }).catch(err => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
    });
});

module.exports = router;