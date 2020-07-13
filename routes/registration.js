const express = require('express');
const router = express.Router()
const bcrypt = require('bcrypt');
const validator = require('validator');
const passport = require('passport');

const Users = require('../models/User');
const {
    forwardAuthenticated
} = require('../config/auth');

// register GET request
router.get('/signup', forwardAuthenticated, function (req, res, next) {
    //console.log('/')
    const about = {
        title: 'Signup - ' + process.env.NAME,
        templateName: 'public/signup',
        devTest: 'dev_signup',
        name: process.env.NAME
    };
    return res.render('base', about);
});

// register POST request
router.post('/signup', (req, res) => {
    console.log('new signup')
    const {
        name,
        email,
        password,
        password2
    } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({
            msg: 'Please enter all fields'
        });
    }

    if (password != password2) {
        errors.push({
            msg: 'Passwords do not match'
        });
    }

    if (password.length < 6) {
        errors.push({
            msg: 'Password must be at least 6 characters'
        });
    }

    if (errors.length > 0) {
        console.log('errors error')
        res.render('public/signup', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        console.log('user finding error')
        console.log(email, name, password, password2)
        Users.findOne({
            email: email
        }).then(user => {
            console.log(user)
            if (user) {
                console.log('user found but error')
                errors.push({
                    msg: 'Email already exists'
                });
                res.render('public/signup', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                console.log('new user error')
                const newUser = new Users({
                    name,
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    console.log('salt error')
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        console.log('hash error')
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                res.redirect('/login');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

// login GET request
router.get('/login', forwardAuthenticated, function (req, res, next) {
    console.log(req.user)
    passport.authenticate('local', {
        failureRedirect: '/login'
    })
    if (req.user) {
        return res.redirect('/');
    }
    const about = {
        title: 'Login - ' + process.env.NAME,
        templateName: 'public/login',
        devTest: 'dev_login',
        name: process.env.NAME
    };
    return res.render('base', about);
    console.log(req.user)
});

// login POST request
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        // failureFlash: true
    })(req, res, next);
});

// logout POST request
router.get('/logout', (req, res) => {
    req.logout();
    // req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});

module.exports = router