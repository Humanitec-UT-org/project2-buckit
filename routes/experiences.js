var express = require('express');
var router = express.Router();

const User = require('../models/user')
const Experience = require('../models/experience')
const Location = require('../models/location')
const Comment = require('../models/comment')
const http = require('http');

//middleware
const isAuthenticated = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

router.get('/', (req, res) => {
  let queryString = req.query.term;
  // ENCODE THE QUERY STRING TO REMOVE WHITE SPACES AND RESTRICTED CHARACTERS
  let term = encodeURIComponent(queryString);
  // PUT THE SEARCH TERM INTO THE GIPHY API SEARCH URL
  let url = 'http://api.giphy.com/v1/gifs/search?q=' + term + '&api_key=dc6zaTOxFJmzC';
  http.get(url, (response) => {
    // SET ENCODING OF RESPONSE TO UTF8
    response.setEncoding('utf8');
    let body = '';
    // listens for the event of the data buffer and stream
    response.on('data', (d) => {
      // CONTINUOUSLY UPDATE STREAM WITH DATA FROM GIPHY
      body += d;
    });
    // once it gets data it parses it into json 
    response.on('end', () => {
      // WHEN DATA IS FULLY RECEIVED PARSE INTO JSON
      let parsed = JSON.parse(body);
      // RENDER THE HOME TEMPLATE AND PASS THE GIF DATA IN TO THE TEMPLATE
      res.render('search-giphy', { gifs: parsed.data })
    });
  });
});


/* https://api.giphy.com/v1/gifs/random?api_key=zIwQPWrbNtodP1xQXb01UpG5FDu2eQqm&tag=&rating=G 
https://api.giphy.com/v1/gifs/search?api_key=zIwQPWrbNtodP1xQXb01UpG5FDu2eQqm&q=&limit=25&offset=0&rating=G&lang=en*/

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

router.post('/:experience_id/delete', (req, res, next) => {
  Experience.findByIdAndRemove({ _id: req.params.experience_id })
    .then(() =>
      res.redirect('/profile')
    )
    .catch(err => next(err))
})


module.exports = router;