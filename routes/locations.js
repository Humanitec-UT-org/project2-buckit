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
    let { title, expireDate, plan, comments, location } = req.body;
    Location.create({ title, expireDate, plan, comments, owner: req.user, location })
        .then(() => {
            res.redirect('/profile');
        })

})

//GET /locations/:id/edit 

router.get('/:location_id/edit-location', (req, res, next) => {
    Location.findById(req.params.location_id).then((result) => {
        //  console.log("result", result)
        res.render('locations/edit-location', result);
    })
});

//POST /locations/:id/ 
router.post('/:location_id', (req, res, next) => {
    const { title, expireDate, plan, comments, location } = req.body;
    Location.update(
        { _id: req.params.location_id },
        { title, expireDate, plan, comments, location }).then(() => {
            res.redirect('/profile')
        })
});

//GET /:id/add-comment

router.get('/:location_id/add-comment', (req, res, next) => {
    Location.findById(req.params.location_id).then((result) => {
        console.log("result", result)
        res.render('locations/add-comment', result);
    })
});




// POST /locations/add-comment
router.post('/:location_id/comments', function (req, res, next) {
    let { comment, owner } = req.body;
    Comment.create({ comment, owner, owner: req.user, location: req.params.location_id })
        .then(() => {
            res.redirect('/feed');
            console.log("Comment", comment, owner)
        })

})

//DELETE :location_id/delete
router.post('/:location_id/delete', (req, res, next) => {
    Location.findByIdAndRemove({ _id: req.params.location_id })
        .then(() =>
            res.redirect('/profile')
        )
        .catch(err => next(err))
})
module.exports = router;
