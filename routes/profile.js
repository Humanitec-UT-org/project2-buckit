var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const bcryptSalt = 10;
const uploadCloud = require('../config/cloudinary.js');

const User = require('../models/user')
const Experience = require('../models/experience')
const Location = require('../models/location')
const Comment = require('../models/comment')

//middleware
const isAuthenticated = (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.redirect('/login')
    }
}

/* GET /profile . */
router.get('/', isAuthenticated, function (req, res, next) {
    Promise.all([
        Experience.find({ owner: req.user._id }).then(experiences => {
            let experienceIDs = experiences.map(experience => experience._id);
            return Comment.find({ experience: { $in: experienceIDs } }).populate('owner').then(comments => {
                console.log(comments);
                for (let experience of experiences) {
                    experience.comments = comments
                        .filter(comment => comment.experience.equals(experience._id));
                }
                return experiences;
            })
        }),

        Location.find({ owner: req.user._id }).populate('owner').then(locations => {
            let locationIDs = locations.map(location => location._id);
            return Comment.find({ location: { $in: locationIDs } }).populate('owner').then(comments => {
                console.log(comments);
                for (let location of locations) {
                    location.comments = comments
                        .filter(comment => comment.location.equals(location._id));
                }
                return locations;
            })
        })
    ])
        .then(([experiences, locations]) => {

            //Sort experience from latest to oldest
            experiences.sort((a, b) => new Date(a.expireDate) - new Date(b.expireDate))
            //Sort location from latest to oldest
            locations.sort((a, b) => new Date(a.expireDate) - new Date(b.expireDate))
            res.render('profile/index', { user: req.user, experiences, locations });
        })
})

// GET and Edit one's profile page. 	
router.get('/:user_id/edit', isAuthenticated, function (req, res, next) {
    User.findById(req.params.user_id).then((users) => {
        res.render('profile/edit-user', { users, user: req.user });
    });
})


// POST /profile/:user_id/edit   
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


module.exports = router;
