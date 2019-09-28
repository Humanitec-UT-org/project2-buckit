var express = require('express');
var router = express.Router();

const User = require('../models/user') // LL 20.09.
const Experience = require('../models/experience') // LL 20.09.
const Location = require('../models/location') // LL 20.09.

/* GET users listing. */
// router.get('/', function (req, res, next) {
//   res.render('feed');
// });
//collection.find().sort({datefield: -1}, function(err, cursor){...});
router.get('/', function (req, res, next) {
  Promise.all([User.find(), Experience.find(), Location.find()])
    .then(([users, experiences, locations]) => {
      //Sort experiences from oldest to latest
      experiences.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      locations.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      console.log(experiences)
      // console.log(experiences)
      //Sort locations from oldest to latest
      res.render('feed', { user: req.user, experiences, locations }); // LL 2009
    })
})
// Promise.all([User.find(), Experience.find({ owner: req.user._id }), Location.find({ owner: req.user._id })])
// .then(([users, experiences, locations]) => {
//     //Sort experience from latest to oldest
//     experiences.sort((a, b) => new Date(b.expireDate) - new Date(a.expireDate))
//     //Sort location from latest to oldest
//     locations.sort((a, b) => new Date(b.expireDate) - new Date(a.expireDate))
//     console.log(experiences)
//     res.render('profile/index', { user: req.user, experiences, locations }); // LL 2009
// })
module.exports = router;
