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
    User.find().then((allUsers) => { // TODO: Note that this should use 'populate'
        res.render('people/index', { users: allUsers });
    })
});


// GET one's profile page. 
router.get('/:user_id', isAuthenticated, function (req, res, next) {
    Promise.all([User.findById(req.params.user_id),
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
    Location.find({ owner: req.user._id }).then(locations => {
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

// router.get('/', function (req, res, next) {
//     User.find().then((users) => {  // LL 2009
//         res.render('people/index', { users, user: req.user }) // LL 2009
//     })

// });

// // GET /experiences/add
// router.get('/add', isAuthenticated, function (req, res, next) {
//     res.render('rooms/add')
// });

// // POST /rooms
// router.post('/', isAuthenticated, function (req, res, next) {
//     let { name, description } = req.body
//     Room.create({ name, description }).then(() => {
//         res.redirect('/rooms')
//     })
// });

// // GET /rooms/:room_id/edit
// router.get('/:room_id/edit', isAuthenticated, function (req, res, next) {
//     Room.findById(req.params.room_id).then((room) => {
//         if (!room.owner._id.equals(req.user._id)) {
//             res.redirect('/login')
//         } else {
//             res.render('rooms/edit', { room })
//         }

//     }).catch((error) => res.send(error.toString()));

// });

// // POST /rooms/:room_id
// router.post('/:room_id', isAuthenticated, function (req, res, next) {
//     let { name, description } = req.body

//     Room.findById(req.params.room_id).then((room) => {

//         if (!room.owner.equals(req.user._id)) {
//             res.redirect('/login')
//         } else {
//             Room.findByIdAndUpdate(req.params.room_id, { name, description }).then(() => {
//                 res.redirect('/rooms')
//             })

//         }

//     })
// });

// // GET /locations/
// router.get('/', function (req, res, next) {
//     Location.find().then((locations) => {  // LL 2009
//         res.render('profile/index', { locations, user: req.user }) // LL 2009
//     })
// })
module.exports = router;
