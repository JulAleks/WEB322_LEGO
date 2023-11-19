/********************************************************************************
 * WEB322 – Assignment 05
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Julia Alekseev Student ID: 051292134 Date: Nov 19, 2023
 *
 * Published URL: https://dull-red-lovebird-shoe.cyclic.app/
 ********************************************************************************/

// set up sequelize
const Sequelize = require("sequelize");
require("dotenv").config();

// set up sequelize to point to our postgres database
let sequelize = new Sequelize("web", "JulAleks", "rFu93tiodhNf", {
  host: "ep-dawn-queen-70040841.us-east-2.aws.neon.tech",
  dialect: "postgres",
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
  query: { raw: true },
});

// Define a Theme model
const Theme = sequelize.define(
  "Theme",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

// Define a Set model
const Set = sequelize.define(
  "Set",
  {
    set_num: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    theme_id: Sequelize.INTEGER,
    img_url: Sequelize.STRING,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

// Create an association between Set and Theme
Set.belongsTo(Theme, {
  foreignKey: "theme_id",
});

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected and the LEGO IS HERE");
  })
  .catch((err) => {
    console.log("Unable to find your LEGO", err);
  });

module.exports.initialize = () => {
  return sequelize
    .sync()
    .then(() => {
      return Promise.resolve();
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

// fill the sets
module.exports.getAllSets = () => {
  return Set.findAll({
    include: [{ model: Theme, attributes: ["name"] }],
    raw: true,
  })
    .then((setsFromDatabase) => {
      return Promise.resolve(setsFromDatabase);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

// returns a specific set by id
module.exports.getSetByNum = (setNum) => {
  return Set.findOne({
    where: { set_num: setNum },
    attributes: ["set_num", "name", "year", "num_parts", "img_url"],
    include: [{ model: Theme, attributes: ["name"] }],
    raw: true,
  })
    .then((setFromDatabase) => {
      return Promise.resolve(setFromDatabase);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

// Returns sets by theme
module.exports.getSetsByTheme = (theme) => {
  return Set.findAll({
    include: [
      {
        model: Theme,
        attributes: ["name"],
        required: false,
      },
    ],
    where: {
      "$Theme.name$": {
        [Sequelize.Op.iLike]: `%${theme}%`,
      },
    },
    raw: true,
  })
    .then((setsFromDatabase) => {
      return Promise.resolve(setsFromDatabase);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
