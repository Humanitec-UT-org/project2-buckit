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

/* GET profile page. */
router.get('/', function (req, res, next) {
    Promise.all([User.find(), Experience.find(), Location.find()]).then(([users, experiences, locations]) => {
        res.render('profile/index', { user: users[0], experiences, locations }); // LL 2009
    })
})

// GET /experiences/
router.get('/', function (req, res, next) { //ES5 and ES6 in 1 function > best practice?
});

// GET /experiences/add
router.get('/add-experience', isAuthenticated, function (req, res, next) { //isAuthenticated?
    res.render('profile/add-experience')
});

router.post('/', isAuthenticated, function (req, res, next) {
    let { title } = req.body;
    Experience.create({ title, owner: req.user })
        .then(() => {
            res.redirect('/profile');
        })
})
// //#4 POST celebrities/new
// router.post('/', (req, res, next) => {
//     const { name, occupation, catchPhrase } = req.body;
//     const newCelebrity = new Celebrity({ name, occupation, catchPhrase });
//     console.log("schritt 4")
//     newCelebrity.save()
//       .then(() =>
//         res.redirect('/celebrities')
//       )
//       .catch((err) =>
//         res.render('celebrities/new'))
//   })
// POST /experience
router.post('/', isAuthenticated, function (req, res, next) {
    let { name, description } = req.body;
    const newExperience = new Experience({ name, description });
    console.log("created new exp")
    // newExperience.create({ name, description }).then(() => { //.create or .save Method? CHANGES from LL to CH
    //     res.redirect('/rooms')
    // })
    newExperience.save()
        .then(() =>
            res.redirect('/profile/index') //where to redirect to?
        )
        .catch((err) =>
            res.render('experiences/add'))
});

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

module.exports = router;
