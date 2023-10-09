/********************************************************************************
 * WEB322 – Assignment 02
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Julia Alekseev Student ID: 051292134 Date: Oct 10, 2023
 *
 * Published URL: https://dull-red-lovebird-shoe.cyclic.app/
 ********************************************************************************/

// sets jason
const setData = require("../data/setData");
const themeData = require("../data/themeData");

// empty sets array
let sets = [];

// fill the sets
module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    setData.forEach((set) => {
      const legoTheme = themeData.find(
        (element) => element.id === set.theme_id
      );
      if (legoTheme) {
        const setWithTheme = { ...set, legoTheme: legoTheme.name };
        sets.push(setWithTheme);
      } else {
        reject(new Error("No LEGO for you!!!"));
      }
    });
    resolve();
  });
};

// returns the complete sets array
module.exports.getAllSets = () => {
  return new Promise((resolve, reject) => {
    if (sets) {
      resolve(sets);
    } else {
      reject(new Error("No LEGO sets for you!!!"));
    }
  });
};

// returns a specific set by id
module.exports.getSetByNum = (setNum) => {
  return new Promise((resolve, reject) => {
    const foundSet = sets.find((element) => element.set_num === setNum);
    if (foundSet) {
      resolve(foundSet);
    } else {
      reject(new Error(`Can't find LEGO set ID number: ${setNum}`));
    }
  });
};

// returns a specific set by theme
module.exports.getSetsByTheme = (theme) => {
  return new Promise((resolve, reject) => {
    const foundSets = sets.filter((element) => {
      return element.legoTheme.toLowerCase().includes(theme.toLowerCase());
    });
    if (foundSets.length) {
      resolve(foundSets);
    } else {
      reject(new Error(`Can't find requested LEGO set theme: ${theme}`));
    }
  });
};
