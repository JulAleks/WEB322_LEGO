/********************************************************************************
 * WEB322 – Assignment 06
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Julia Alekseev Student ID: 051292134 Date: Nov 26, 2023
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

///////////////////////////////////////////////////
const dbURI = process.env.MONGODB;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("Connected to MongoDB!");
});

const User = mongoose.model("User", userSchema);

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    const db = mongoose.connection;

    db.on("error", (err) => {
      reject(err);
    });

    db.once("open", () => {
      User = mongoose.model("users", userSchema);
      resolve(User);
    });
  });
};
///////////////////////////////////////////////////////////////
module.exports.registerUser = (userData) => {
  return new Promise((resolve, reject) => {
    if (userData.password != userData.password2) {
      reject("Passwords do not match");
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
                reject("There was an error creating the user:" + err);
              }
            });
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
};

////////////////////////////////////////////////////////////////////////////////////

module.exports.checkUser = function (userData) {
  return new Promise(function (resolve, reject) {
    User.find({ userName: userData.userName })
      .exec()
      .then((users) => {
        if (users.length === 0) {
          reject("Unable to find user: " + userData.userName);
        } else {
          bcrypt
            .compare(userData.password, users[0].password)
            .then((passwordMatch) => {
              if (!passwordMatch) {
                reject("Incorrect Password for user: " + userData.userName);
              } else {
                const newLoginHistoryEntry = {
                  dateTime: new Date().toString(),
                  userAgent: userData.userAgent,
                };

                users[0].loginHistory.push(newLoginHistoryEntry);

                User.updateOne(
                  { userName: users[0].userName },
                  { $set: { loginHistory: users[0].loginHistory } }
                )
                  .exec()
                  .then(() => {
                    resolve(users[0]);
                  })
                  .catch((err) => {
                    reject("There was an error while verifying user: " + err);
                  });
              }
            })
            .catch((err) => {
              reject("There was an error while comparing passwords: " + err);
            });
        }
      })
      .catch((err) => {
        reject("Unable to find user: " + userData.userName);
      });
  });
};
