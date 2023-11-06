/********************************************************************************
 * WEB322 – Assignment 04
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Julia Alekseev Student ID: 051292134 Date: Nov 05, 2023
 *
 * Published URL: https://dull-red-lovebird-shoe.cyclic.app/
 ********************************************************************************/

const express = require("express");
const app = express();
const path = require("path");
const HTTP_PORT = 8080;
const legoData = require("./modules/legoSets");

// set the view engine to EJS
app.set("view engine", "ejs");

// static files from the public directory
app.use(express.static("public"));

// init LEGO data
legoData
  .initialize()
  .then(() => {
    console.log("LEGO data initialized!");
  })
  .catch((error) => {
    console.error("No LEGO for YOU!", error.message);
    res.status(404).render("404", {
      message: "I'm sorry, the Racoons took all the lego, cannot initialize.",
    });
  });

//home page
app.get("/", (req, res) => {
  res.render("home", { page: "home" });
  console.log("This is HOMEPAGE");
});

//display legos
app.get("/lego/sets", (req, res) => {
  const theme = req.query.theme;
  if (theme) {
    legoData
      .getSetsByTheme(theme)
      .then((sets) => {
        res.render("sets", { sets: sets });
        console.log("Showing LEGO sets by Theme");
      })
      .catch((error) => {
        console.error("No LEGO for YOU!", error.message);
        res.status(404).render("404", {
          message:
            "I'm sorry, the Racoons did it again, they erased all the themes, and we cannot find your themed LEGO.",
        });
      });
  } else {
    legoData
      .getAllSets()
      .then((sets) => {
        res.render("sets", { sets: sets });
        console.log("Showing all LEGO sets");
      })
      .catch((error) => {
        console.error("No LEGO for YOU!", error.message);
        res.status(404).render("404", {
          message:
            "I'm sorry, the Racoons rearranged all the LEGO sets, and we cannot display them at the moment.",
        });
      });
  }
});

// about
app.get("/about", (req, res) => {
  res.render("about", { page: "about" });
  console.log("ALL ABOUT ME");
});

// display LEGO by num
app.get("/lego/sets/:setNum", (req, res) => {
  const setNum = req.params.setNum;
  legoData
    .getSetByNum(setNum)
    .then((set) => {
      res.render("set", { set: set });
      console.log("Showing LEGO set by Num");
    })
    .catch((error) => {
      console.error("No LEGO for YOU!", error.message);
      res.status(404).render("404", {
        message:
          "I'm sorry, Halloween raccoons stole all the numbers, and we can't find your LEGO set by number.",
      });
    });
});

// 404 errors
app.get("*", (req, res) => {
  res.status(404).render("404", {
    message:
      "I'm sorry, ninja raccoons made it impossible to see, just like the page you were looking for.",
  });
});

//app listen
app.listen(HTTP_PORT, () => {
  console.log("server listening on " + HTTP_PORT);
});
