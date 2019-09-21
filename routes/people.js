var express = require('express');
var router = express.Router();

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



// router.get('/', (req, res, next) => {
//     Movie.find().populate('actors').then((allMovies) => { // TODO: Note that this should use 'populate'
//       res.render('movies/index', { movies: allMovies });
//     })
//   });

router.get('/', (req, res, next) => {
    User.find().populate('usernames').then((allUsers) => { // TODO: Note that this should use 'populate'
        res.render('people/index', { users: allUsers });
    })
});


router.get('/', function (req, res, next) {
    User.find().then((users) => {  // LL 2009
        res.render('people/index', { users, user: req.user }) // LL 2009
    })

});

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
