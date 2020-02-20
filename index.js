const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');

const app = express();

const userDB = {};

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
  const userId = req.cookies.user_id;

  const currentUser = userDB[userId];

  res.render('index', { currentUser });
});

// USERS

app.get('/users/new', (req, res) => {
  res.render('users/new');
});

app.post('/users', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(422).send('Please provide a username and password');
    return;
  }

  bcrypt.hash(password, 10)
    .then(passwordHashed => {
      const userId = uuid();
      const newUser = {
        id: userId,
        username,
        password: passwordHashed
      };

      userDB[userId] = newUser;
      console.log(newUser);

      res.cookie('user_id', userId);
      res.redirect('/');
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

// SESSIONS

app.get('/sessions/new', (req, res) => {
  res.render('sessions/new');
});

app.post('/sessions', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(422).send('Please provide a username and password');
    return;
  }

  let foundUser;
  for (let userId in userDB) {
    if (userDB[userId].username === username) {
      foundUser = userDB[userId];
      break;
    }
  }

  if (foundUser) {
    bcrypt.compare(password, foundUser.password)
      .then((correct) => {
        if (correct) {
          res.cookie('user_id', foundUser.id);
          res.redirect('/');
        } else {
          res.status(401).send('Invalid username or password');
        }
      });
  } else {
    res.status(401).send('Invalid username or password');
  }
});

app.get('/sessions/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/');
});

app.listen(8080, () => {
  console.log('Application is running on http://localhost:8080');
});
