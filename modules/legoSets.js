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

// set up sequelize
require("dotenv").config();
const Sequelize = require("sequelize");

let sequelize = new Sequelize({
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
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
    include: [{ model: Theme, attributes: ["id", "name"] }],
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

// find set by theme
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

// funct to find themes
module.exports.getThemes = () => {
  return Theme.findAll({
    attributes: ["id", "name"],
    raw: true,
  })
    .then((themesFromDatabase) => {
      return Promise.resolve(themesFromDatabase);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

//get teams to add set
module.exports.getAllThemes = () => {
  return Set.findAll({
    include: [
      {
        model: Theme,
        attributes: ["id", "name"],
        required: false,
      },
    ],
    raw: true,
  })
    .then((themesFromDatabase) => {
      return Promise.resolve(themesFromDatabase);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

//post set
module.exports.addSet = (setData) => {
  console.log("setData:", setData);
  return Set.create(setData)
    .then(() => {
      return Promise.resolve();
    })
    .catch((err) => {
      return Promise.reject(err.errors[0].message);
    });
};

//edit
module.exports.editSet = (setNum, setData) => {
  return Set.update(setData, {
    where: { set_num: setNum },
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((err) => {
      return Promise.reject(err.errors[0].message);
    });
};

//delete
module.exports.deleteSet = (setNum, setData) => {
  return Set.destroy({
    where: { set_num: setNum },
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((err) => {
      if (err.errors && err.errors.length > 0) {
        return Promise.reject(err.errors[0].message);
      }
    });
};
