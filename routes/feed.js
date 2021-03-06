var express = require('express');
var router = express.Router();

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


router.get('/', isAuthenticated, function (req, res, next) {
  Promise.all([
    Experience.find().populate('owner').then(experiences => {
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

    Location.find().populate('owner').then(locations => {
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
      //Sort experiences from oldest to latest
      experiences.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        locations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      console.log(experiences)

      res.render('feed', { user: req.user, experiences, locations });
    })
})



module.exports = router;
