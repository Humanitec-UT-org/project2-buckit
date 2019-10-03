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

router.get('/search-gif', (req, res, next) => {
  res.render('search-giphy');
})

router.post('/search-gif', (req, res) => {

  const query = req.body['giphy-query']
  const url = `http://api.giphy.com/v1/gifs/search?api_key=zIwQPWrbNtodP1xQXb01UpG5FDu2eQqm&q=${query}`;

  request.get(url, (err, response, body) => {
    if (err) { console.error(err) }

    body = JSON.parse(body);

    // First, we select a random .gif from the Giphy results and get the URL
    const randomResult = body.data[Math.floor(Math.random() * body.data.length)];
    const searchResultUrl = randomResult.images.fixed_height.url;

    // Then we pass the URL to search.hbs
    res.render('search-giphy', { searchResultUrl: searchResultUrl });
  });
});


/* https://api.giphy.com/v1/gifs/random?api_key=zIwQPWrbNtodP1xQXb01UpG5FDu2eQqm&tag=&rating=G 
https://api.giphy.com/v1/gifs/search?api_key=zIwQPWrbNtodP1xQXb01UpG5FDu2eQqm&q=&limit=25&offset=0&rating=G&lang=en */

// GET /experiences/add
router.get('/add-experience', isAuthenticated, function (req, res, next) { //isAuthenticated?

  res.render('experiences/add-experience');


});


// POST /experiences/add
router.post('/', isAuthenticated, function (req, res, next) {

  let { title, plan, comments, locations, expireDate, imageUrl } = req.body;
  Experience.create({ title, plan, comments, locations, expireDate, owner: req.user, imageUrl })
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

//POST (edits) /:id/ 

router.post('/:experience_id', (req, res, next) => {
  const { title, plan, comments, locations, expireDate, imageUrl } = req.body;
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