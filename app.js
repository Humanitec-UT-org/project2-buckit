const createError = require('http-errors');
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('dotenv').config()

const flash = require("connect-flash")


const mongoose = require('mongoose');
const dbName = 'project2-buckit';
mongoose.connect(`mongodb://localhost/${dbName}`);


const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo")(session);

const app = express();



app.use(session({
  secret: "abc", // does not matter at all
  store: new MongoStore({ // this is going to create the `sessions` collection in the db
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

app.use(flash())

require('./config/passport.js')
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//CH: this is a try***START
// const profileRouter = require("./routes/profile");
// const location = require("./routes/profile");
//CH: this is a try***END
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const feedRouter = require('./routes/feed');
// /feed will bring you to other users lists 
const profileRouter = require('./routes/profile');
const peopleRouter = require('./routes/people')
const locationsRouter = require('./routes/locations')
const experiencesRouter = require('./routes/experiences')
var moment = require('moment');
moment().format();
app.use('/', indexRouter);
app.use('/', authRouter); // /login instead of /auth/login
// app.use('/auth', authRouter);  // /auth/login would look like this
app.use('/feed', feedRouter);
//CH: this is a try***START (We want exp and location BOTH on /profile)
app.use('/profile', profileRouter);
//CH: this is a try***END
app.use('/people', peopleRouter);
app.use('/locations', locationsRouter);
app.use('/experiences', experiencesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;