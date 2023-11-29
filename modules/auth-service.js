/********************************************************************************
 * WEB322 – Assignment 06
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Julia Alekseev Student ID: 051292134 Date: Nov 29, 2023
 *
 * Published URL: https://dull-red-lovebird-shoe.cyclic.app/
 ********************************************************************************/
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
/////////////////////////////////////////////////////////////////////////////
//Schema
let Schema = mongoose.Schema;
let userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
  },
  password: String,
  email: String,
  loginHistory: [
    {
      dateTime: Date,
      userAgent: String,
    },
  ],
});

/////////////////CONNECTION/////////////////////////
// const for connection
const db = mongoose.connection;

// connecting to db
mongoose.connect(process.env.MONGODB, {
  useCreateIndex: true, // Recommended to handle deprecation of ensureIndex
});

// user const connected to mongo and schema
let User = mongoose.model("User", userSchema);

// init mongo
module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    db.on("error", (err) => {
      reject(err);
    });

    db.once("open", () => {
      User = mongoose.model("users", userSchema);
      resolve(User);
    });
  });
};

////////////////////REGISTARTION///////////////////////////////////
module.exports.registerUser = (userData) => {
  return new Promise((resolve, reject) => {
    if (userData.password != userData.password2) {
      reject("Trash panda says: 'Wrong password combo!'");
    } else {
      bcrypt
        .hash(userData.password, 10)
        .then((hash) => {
          userData.password = hash;
          let newUser = new User(userData);
          newUser
            .save()
            .then(() => {
              resolve();
            })
            .catch((err) => {
              if (err.code === 11000) {
                reject("Raccoon already took that name");
              } else {
                reject("Raccoon mischief alert: Couldn't create user - " + err);
              }
            });
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
};

//////////////////////////////USER CHECKER//////////////////////////////////////

module.exports.checkUser = (userData) => {
  return new Promise((resolve, reject) => {
    console.log("User Agent in checkUser:", userData.userAgent);
    User.find({ userName: userData.userName })
      .exec()
      .then((users) => {
        if (users.length === 0) {
          reject(
            "Lost in the raccoon maze: Can't find user - " + userData.userName
          );
        } else {
          bcrypt
            .compare(userData.password, users[0].password)
            .then((passwordMatch) => {
              if (!passwordMatch) {
                reject(
                  "Password fail for raccoon operative: " + userData.userName
                );
              } else {
                const newHistory = {
                  dateTime: new Date().toString(),
                  userAgent: userData.userAgent,
                };

                users[0].loginHistory.push(newHistory);

                User.updateOne(
                  { userName: users[0].userName },
                  { $set: { loginHistory: users[0].loginHistory } }
                )
                  .exec()
                  .then(() => {
                    resolve(users[0]);
                  })
                  .catch((err) => {
                    reject("Raccoon authentication fail: " + err);
                  });
              }
            })
            .catch((err) => {
              reject("Password showdown with raccoons went haywire: " + err);
            });
        }
      })
      .catch((err) => {
        reject(
          "Raccoon detectives lost the trail for user: " + userData.userName
        );
      });
  });
};
