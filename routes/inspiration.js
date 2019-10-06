var express = require('express');
var router = express.Router();

// var pinterest = require('pinterest-node-api')('YOUR_ACCESS_TOKEN');

//middleware

const isAuthenticated = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

// GET /inspirations/index
router.get('/', isAuthenticated, function (req, res, next) {
  res.render('inspirations/index')
});

/* Return the logged in user's information */

/* pinterest.setUserToken(userToken);
var data = {};
try {
  var response = pinterest.users.getUserOwnInfo(data);
} catch (error) {
  return;
}
 */


//Retrieve the Pins on a Board 

/* pinterest.setUserToken(userToken);
var board = 'pideveloper/test-board';
try {
  var response = pinterest.boards.getBoardPins(board);
} catch (error) {
  return;
}  
 */
module.exports = router;
