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

/* GET profile page. */
router.get('/', function (req, res, next) {
  Promise.all([User.find(), Experience.find(), Location.find()]).then(([users, experiences, locations]) => {
    //  console.log("Experience", experiences);
    res.render('profile/index', { user: users[0], experiences, locations });
  })
})

// GET /experiences/add
router.get('/add-experience', isAuthenticated, function (req, res, next) { //isAuthenticated?
  res.render('experiences/add-experience')
});
// POST /experiences/add
router.post('/', isAuthenticated, function (req, res, next) {
  let { title, plan, comments, locations, expireDate } = req.body;
  Experience.create({ title, plan, comments, locations, expireDate, owner: req.user })
    .then(() => {
      res.redirect('/profile');
      //console.log("Experience", experiences)
    })

})

//GET /:id/edit 

router.get('/:experience_id/edit-experience', (req, res, next) => {
  Experience.findById(req.params.experience_id).then((result) => {
    //console.log("result", result)
    res.render('experiences/edit-experience', result);
  })
});

//POST /:id/ 

router.post('/:experience_id', (req, res, next) => {
  const { title, plan, comments, locations, expireDate } = req.body;
  Experience.update(
    { _id: req.params.experience_id },
    { title, plan, comments, locations, expireDate, owner: req.user }).then(() => {
      res.redirect('/profile')
    })
});

//GET /:id/add-comment

router.get('/:experience_id/add-comment', (req, res, next) => {
  Experience.findById(req.params.experience_id).then((result) => {
    console.log("result", result)
    res.render('experiences/add-comment', result);
  })
});




// POST /experiences/add-comment
router.post('/:experience_id/comments', function (req, res, next) {
  let { comment, owner } = req.body;
  Comment.create({ comment, owner, owner: req.user, experience: req.params.experience_id })
    .then(() => {
      res.redirect('/feed');
      console.log("Comment", comment, owner)
    })

})
// Experience.update(
//   { _id: req.params.experience_id },
//   { title, plan, comments, locations, expireDate, owner: req.user }).then(() => {
//     res.redirect('/profile')
//   })

router.post('/:experience_id/delete', (req, res, next) => {
  Experience.findByIdAndRemove({ _id: req.params.experience_id })
    .then(() =>
      res.redirect('/profile')
    )
    .catch(err => next(err))
})

module.exports = router;