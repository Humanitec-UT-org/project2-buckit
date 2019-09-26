var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const bcryptSalt = 10;

const User = require('../models/user') // LL 20.09.
const Experience = require('../models/experience') // LL 20.09.
const Location = require('../models/location') // LL 20.09.
//FAIROUZ THIS IS CORRECT 
//middleware
const isAuthenticated = (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.redirect('/login')
    }
}
//find function can take params > only experiences of a certain condition req.user.id
/* GET profile page. */
router.get('/', function (req, res, next) {
    Promise.all([User.find(), Experience.find(/* {owner: req.user_id} */), Location.find()]).then(([users, experiences, locations]) => {
        res.render('profile/index', { user: users[0], experiences, locations }); // LL 2009
    })
})

// GET and Edit one's profile page. --> the browser does not get the connection, but the link and the edit-form works	
router.get('/:user_id/edit', isAuthenticated, function (req, res, next) { // LL 2209	
    User.findById(req.params.user_id).then((users) => {              // LL 2209	
        res.render('profile/edit-user', { users, user: req.user }); // LL 2209	
    });
})


// POST /profile/:user_id/edit   --> see NOTE at line 45	
router.post('/:user_id', isAuthenticated, function (req, res, next) {
    let { username, email, imageUrl, bio } = req.body
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    User.findById(req.params.user_id).then(() => {


        User.findByIdAndUpdate(req.params.user_id, { username, email, imageUrl, bio, password: hashPass }).then(() => {
            res.redirect('/profile') // LL 2209 PASSWORD still has to be hashed!	
        })
    })
});
//query in mongo DB the user > we need a query that looks for the user
// GET /experiences/add
router.get('/add-experience', isAuthenticated, function (req, res, next) { //isAuthenticated?
    res.render('profile/add-experience')
});

// POST /experience/add
router.post('/', isAuthenticated, function (req, res, next) {
    let { title, plan, comments, locations } = req.body;
    Experience.create({ title, plan, comments, locations, owner: req.user })
        .then(() => {
            res.redirect('/profile');
        })
})


module.exports = router;
