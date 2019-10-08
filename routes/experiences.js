var express = require('express');
var router = express.Router();

const User = require('../models/user')
const Experience = require('../models/experience')
const Location = require('../models/location')
const Comment = require('../models/comment')
const request = require('request');

//middleware
const isAuthenticated = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

//get gif search
router.get('/:experience_id/search-gif', (req, res, next) => {
  const experience_id = req.params.experience_id
  res.render('search-giphy', { experience_id });
})

//post gif result
router.post('/:experience_id/search-gif', (req, res) => {

  const experience_id = req.params.experience_id
  const query = req.body['giphy-query']
  const url = `http://api.giphy.com/v1/gifs/search?api_key=zIwQPWrbNtodP1xQXb01UpG5FDu2eQqm&q=${query}`;

  request.get(url, (err, response, body) => {
    if (err) { console.error(err) }
    body = JSON.parse(body);
    // select a random .gif from the Giphy results and get the URL
    const randomResult = body.data[Math.floor(Math.random() * body.data.length)];
    const searchResultUrl = randomResult ? randomResult.images.fixed_height.url : null;

    res.render('search-giphy', { experience_id, searchResultUrl: searchResultUrl })

  })
});


router.post('/:experience_id/store-gif', (req, res) => {
  const { title, plan, comments, locations, expireDate, imageUrl } = req.body;
  const experience_id = req.params.experience_id
  /* let imageUrl = searchResultUrl; */
  Experience.findByIdAndUpdate(experience_id, { imageUrl }).then(() => {
    res.redirect('/profile')
  })
})

/* https://api.giphy.com/v1/gifs/random?api_key=zIwQPWrbNtodP1xQXb01UpG5FDu2eQqm&tag=&rating=G 
https://api.giphy.com/v1/gifs/search?api_key=zIwQPWrbNtodP1xQXb01UpG5FDu2eQqm&q=&limit=25&offset=0&rating=G&lang=en */

// GET /experiences/add
router.get('/add-experience', isAuthenticated, function (req, res, next) { //isAuthenticated?
  res.render('experiences/add-experience');
});

// POST /experiences
router.post('/', isAuthenticated, function (req, res, next) {
  let { title, plan, comments, locations, expireDate } = req.body;
  Experience.create({ title, plan, comments, locations, expireDate, owner: req.user })
    .then((doc) => {
      res.redirect(`experiences/${doc._id}/search-gif`);
    })
})

//GET /:id/edit 
router.get('/:experience_id/edit-experience', (req, res, next) => {

  Experience.findById(req.params.experience_id).then((result) => {
    //console.log("result", result)
    res.render('experiences/edit-experience', result);
  })
});

//POST (edits) /:id/ 
router.post('/:experience_id', (req, res, next) => {
  const { title, plan, comments, locations, expireDate, imageUrl, done } = req.body;
  console.log(done);
  // done: done === 'on'
  Experience.update(
    { _id: req.params.experience_id },
    { title, plan, comments, locations, expireDate, owner: req.user, imageUrl }).then(() => {
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

router.post('/:experience_id/delete', (req, res, next) => {
  Experience.findByIdAndRemove({ _id: req.params.experience_id })
    .then(() =>
      res.redirect('/profile')
    )
    .catch(err => next(err))
})

module.exports = router;