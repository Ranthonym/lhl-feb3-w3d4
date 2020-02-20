const express = require('express');
const { createUser } = require('../models/users');

const router = new express.Router();

router.get('/new', (req, res) => {
  res.render('users/new');
});

router.post('/', (req, res) => {
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

module.exports = router;
