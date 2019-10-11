var express = require('express');
var router = express.Router();

const User = require('../models/user') // LL 20.09.
const Experience = require('../models/experience') // LL 20.09.
const Location = require('../models/location') // LL 20.09.
const Comment = require('../models/comment')

//middleware
const isAuthenticated = (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.redirect('/login')
    }
}

var db


// GET all the users in one list
router.get('/', (req, res, next) => {


    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        User.find({ username: regex }, function (err, allUsers) {
            if (err) {
                console.log(err);
            } else {
                if (allUsers.length < 1) {
                    // document.body.input.innerHTML = "No users match that query, please try again.";
                }
                res.render("people/index", { users: allUsers });
            }
        });
    } else {
        User.find().then((allUsers) => { // TODO: Note that this should use 'populate'
            res.render('people/index', { users: allUsers });
        })
    }
})


// GET one's profile page. 
router.get('/:user_id', isAuthenticated, function (req, res, next) {
    Promise.all([User.findById(req.params.user_id),

    Experience.find({ owner: req.params.user_id }).then(experiences => {
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
    Location.find({ owner: req.params.user_id }).then(locations => {
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
        // how to get the owner of an expeerience and location to display it in the /feed
    ])


        .then(([users, experiences, locations]) => {

            //Sort experience from latest to oldest
            experiences.sort((a, b) => new Date(a.expireDate) - new Date(b.expireDate))
            //Sort location from latest to oldest
            locations.sort((a, b) => new Date(a.expireDate) - new Date(b.expireDate))

            res.render('people/show-profile', { users, user: req.user, experiences, locations, owner: req.user._id });
        })
})




function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports = router;
