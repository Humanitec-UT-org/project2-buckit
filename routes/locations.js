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

/* GET /locations */
router.get('/', function (req, res, next) {
    Promise.all([User.find(), Experience.find(), Location.find()]).then(([users, experiences, locations]) => {
        res.render('profile/index', { user: users[0], experiences, locations }); // LL 2009
    })
})

// GET /location/add
router.get('/add-location', isAuthenticated, function (req, res, next) { //isAuthenticated?
    res.render('locations/add-location')
});

router.post('/', isAuthenticated, function (req, res, next) {
    let { title, expireDate, plan, comments } = req.body;
    Location.create({ title, expireDate, plan, comments, owner: req.user })
        .then(() => {
            res.redirect('/profile');
        })
})

//GET /locations/:id/edit 

router.get('/:location_id/edit-location', (req, res, next) => {
    Location.findById(req.params.location_id).then((result) => {
        console.log("result", result)
        res.render('locations/edit-location', result);
    })
});

//POST /locations/:id/ 
router.post('/:location_id', (req, res, next) => {
    const { title, expireDate, plan, comments } = req.body;
    Location.update(
        { _id: req.params.location_id },
        { title, expireDate, plan, comments }).then(() => {
            res.redirect('/profile')
        })
});

//DELETE :location_id/delete
router.post('/:location_id/delete', (req, res, next) => {
    Location.findByIdAndRemove({ _id: req.params.location_id })
        .then(() =>
            res.redirect('/profile')
        )
        .catch(err => next(err))
})
module.exports = router;
