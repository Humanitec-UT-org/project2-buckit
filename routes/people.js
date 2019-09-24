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


// GET all the users in one list
router.get('/', (req, res, next) => {
    User.find().then((allUsers) => { // TODO: Note that this should use 'populate'
        res.render('people/index', { users: allUsers });
    })
});


// GET one's profile page. 
router.get('/:user_id', isAuthenticated, function (req, res, next) {
    Promise.all([User.findById(req.params.user_id), Experience.findById(req.params.exp_id), Location.findById(req.params.loc_id)]).then(([users, experiences, locations]) => {
        res.render('people/show-profile', { users, user: req.user, exp: req.exp, loc: req.loc, experiences, locations });
    });
})
// router.get('/', function (req, res, next) {
//     Promise.all([User.findById(req.params.user_id), Experience.find(), Location.find()]).then(([users, experiences, locations]) => {
//         res.render('profile/index', { user: req.user, experiences, locations }); // LL 2009
//     })
// })

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
