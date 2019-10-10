var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt')
const bcryptSalt = 10;
const User = require('../models/user')

const passport = require("passport")

// GET /login 
router.get('/login', function (req, res, next) {
    let messages = req.flash("messages")
    console.log("test", messages)
    res.render('auth/login', { messages: messages, layout: false });
});

// app.get('/teams', (req, res, next) => {
//   let data = {
//     layout: false
//   }
//   res.render('teams', data);
//  });
// GET /signup 
router.get('/signup', function (req, res, next) {
    res.render('auth/signup', { layout: false });
});

// POST /signup
router.post('/signup', (req, res, next) => {
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    let email = req.body.email
    let username = req.body.username

    User.create({
        username: username,
        email: email,
        password: hashPass
        // username: username, // L on 20.09.

    }).then(() => {
        if (username === "" || password === "" || email === "") {
            res.render("auth/signup", {
                errorMessage: "Indicate a username and an e-mail and a password to sign up"
            });
            return;
        }
        res.redirect('/profile');
    })
});

//POst/login
router.post("/login", passport.authenticate("local", {
    successRedirect: "/feed",
    failureRedirect: "/login",
}));

// GET /logout
router.get('/logout', (req, res, next) => {
    req.logOut()
    res.redirect('/')
})

module.exports = router;
