const express = require('express');
const { loginUser } = require('../models/users');

const router = new express.Router();

router.get('/new', (req, res) => {
  res.render('sessions/new');
});

router.post('/', (req, res) => {
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

router.get('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/');
});

module.exports = router;
