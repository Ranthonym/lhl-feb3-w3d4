const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');

const app = express();

// DATABASE

const userDB = {};

const createUser = (username, password) => {
  return new Promise((resolve, reject) => {
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
        resolve(newUser);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const loginUser = (username, password) => {
  return new Promise((resolve, reject) => {
    let foundUser;
    for (let userId in userDB) {
      if (userDB[userId].username === username) {
        foundUser = userDB[userId];
        break;
      }
    }

    if (!foundUser) {
      reject('Invalid username or password');
      return;
    }

    bcrypt.compare(password, foundUser.password)
      .then((correct) => {
        if (correct) {
          resolve(foundUser);
        } else {
          reject('Invalid username or password');
        }
      });
  });
};

// APP CONFIG

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  const userId = req.cookies.user_id;
  const currentUser = userDB[userId];

  req.currentUser = currentUser;
  res.locals.currentUser = currentUser;
  next();
});

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

app.get('/users/new', (req, res) => {
  res.render('users/new');
});

app.post('/users', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(422).send('Please provide a username and password');
    return;
  }

  createUser(username, password)
    .then(user => {
      res.cookie('user_id', user.id);
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

  loginUser(username, password)
    .then(user => {
      res.cookie('user_id', user.id);
      res.redirect('/');
    })
    .catch(err => {
      res.status(401).send(err);
    });
});

app.get('/sessions/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/');
});

app.listen(8080, () => {
  console.log('Application is running on http://localhost:8080');
});
