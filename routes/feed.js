var express = require('express');
var router = express.Router();

const User = require('../models/user') // LL 20.09.
const Experience = require('../models/experience') // LL 20.09.
const Location = require('../models/location') // LL 20.09.

/* GET users listing. */
// router.get('/', function (req, res, next) {
//   res.render('feed');
// });

router.get('/', function (req, res, next) {
  Promise.all([User.find(), Experience.find(), Location.find()]).then(([experiences, locations]) => {
    res.render('feed', { user: req.user, experiences, locations }); // LL 2009
  })
})

module.exports = router;
