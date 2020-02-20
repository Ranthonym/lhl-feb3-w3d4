const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');

const usersDB = {};

const findUser = (id) => {
  return usersDB[id];
};

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

        usersDB[userId] = newUser;
        console.log(newUser);
        resolve(newUser);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const findUserByUsername = (username) => {
  for (let userId in usersDB) {
    if (usersDB[userId].username === username) {
      return usersDB[userId];
    }
  }
  
  return null;
};

const loginUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const foundUser = findUserByUsername(username);

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

module.exports = {
  createUser, loginUser, findUserByUsername, findUser
};
