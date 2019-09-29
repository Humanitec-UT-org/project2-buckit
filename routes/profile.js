var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const bcryptSalt = 10;
const uploadCloud = require('../config/cloudinary.js');

const User = require('../models/user') // LL 20.09.
const Experience = require('../models/experience') // LL 20.09.
const Location = require('../models/location') // LL 20.09.

//middleware
const isAuthenticated = (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.redirect('/login')
    }
}
//find function can take params > only experiences of a certain condition req.user.id
/* GET /profile . */
//   Promise.all([User.find(), Experience.find().sort({ expireDate: -1 }), Location.find().sort({ expireDate: 1})])
router.get('/', isAuthenticated, function (req, res, next) {
    Promise.all([User.find(), Experience.find({ owner: req.user._id }), Location.find({ owner: req.user._id })])
        .then(([users, experiences, locations]) => {
            //Sort experience from latest to oldest
            experiences.sort((a, b) => new Date(a.expireDate) - new Date(b.expireDate))
            //Sort location from latest to oldest
            locations.sort((a, b) => new Date(a.expireDate) - new Date(b.expireDate))
            console.log(experiences)
            res.render('profile/index', { user: req.user, experiences, locations }); // LL 2009
        })
})

// GET and Edit one's profile page. --> the browser does not get the connection, but the link and the edit-form works	
router.get('/:user_id/edit', isAuthenticated, function (req, res, next) { // LL 2209	
    User.findById(req.params.user_id).then((users) => {              // LL 2209	
        res.render('profile/edit-user', { users, user: req.user }); // LL 2209	
    });
})


// POST /profile/:user_id/edit   --> see NOTE at line 45	
router.post('/:user_id', uploadCloud.single('userImage'), isAuthenticated, function (req, res, next) {
    let { username, email, bio } = req.body

    if (req.file !== undefined) {
        const imageUrl = req.file.url
        User.findByIdAndUpdate(req.params.user_id, { username, email, bio, imageUrl }).then(() => {

            res.redirect('/profile')
        }).catch(err => console.log("something went wrong", error))
    } else {
        User.findByIdAndUpdate(req.params.user_id, { username, email, bio }).then(() => {

            res.redirect('/profile')
        }).catch(err => console.log("something went wrong", error))

    }


});
// Uncommented because there is same code in experience.js
//query in mongo DB the user > we need a query that looks for the user
// // GET /experiences/add
// router.get('/add-experience', isAuthenticated, function (req, res, next) { //isAuthenticated?
//     res.render('profile/add-experience')
// });

// router.post('/', isAuthenticated, function (req, res, next) {
//     let { title, plan, comments, locations } = req.body;
//     Experience.create({ title, plan, locations, comments, owner: req.user })
//         .then(() => {
//             res.redirect('/profile');
//         })

// })



module.exports = router;
