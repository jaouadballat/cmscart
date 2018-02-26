const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

/* GET home page. */
router.get('/register', function (req, res, next) {
    res.render('register', {
        title: 'register'
    });
});

router.post('/register', function (req, res) {
    req.checkBody('username', 'username is required').notEmpty();
    req.checkBody('email', 'email is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
    req.checkBody('confirm_password', 'password not match').equals(req.body.password);
    const errors = req.validationErrors();
    if(errors){
        res.render('register', {
            title: 'register',
            errors: errors
        });
    }else {
        let errors = [];
        User.findOne({email: req.body.email}, function(err, user){
            if(user) {
                errors.push({
                    msg: "This Email Already Exist plear Try again"
                });
                res.render('register', {
                    title: 'register',
                    errors: errors
                });
            }else {
                let username = req.body.username;
                let email = req.body.email;
                let password = req.body.password;
                let user = new User();
                user.username = username;
                user.email = email;
                user.admin = 1;
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                         user.password = hash
                         user.save(function(err) {
                             if(err) return console.log(err);
                             res.redirect('back');
                         });
                    });
                });
            }
        });
    }
});


module.exports = router;
