var express = require('express');
var router = express.Router();
const isAuthenticated = (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.redirect('/login')
    }
}

// GET /inspirations/index
router.get('/', isAuthenticated, function (req, res, next) {
    res.render('about/index')
});


module.exports = router;