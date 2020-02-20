const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

// DATABASE

const { findUser } = require('./models/users');

// APP CONFIG

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// GLOBAL MIDDLEWARE

app.use((req, res, next) => {
  const userId = req.cookies.user_id;
  const currentUser = findUser(userId);

  req.currentUser = currentUser;
  res.locals.currentUser = currentUser;
  next();
});

// HOME PAGE

app.get('/', (req, res) => {
  res.render('index');
});

// PROTECTED PAGE

const protectedMiddleware = (req, res, next) => {
  if (!req.currentUser) {
    res.sendStatus(401);
    return;
  }

  next();
};

app.get('/me', protectedMiddleware, (req, res) => {
  res.render('me');
});

// USERS

const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

// SESSIONS

const sessionRoutes = require('./routes/sessions');
app.use('/sessions', sessionRoutes);

app.listen(8080, () => {
  console.log('Application is running on http://localhost:8080');
});
