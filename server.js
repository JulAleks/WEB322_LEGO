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

const express = require("express");
const app = express();
const path = require("path");
const HTTP_PORT = process.env.PORT || 8080;
const legoData = require("./modules/legoSets");

// init LEGO data
legoData
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () =>
      console.log(`GO to: http://localhost:${HTTP_PORT}/ to see your LEGOS!`)
    );
  })
  .catch((error) => {
    console.error("No LEGO for YOU!", error.message);
    res.status(404).send("No LEGO for YOU!");
  });

//static files from public dir
app.use(express.static("public"));

//HOME
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "views", "home.html");
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Serving home.html");
    }
  });
});

//about
app.get("/views/about.html", (req, res) => {
  const filePath = path.join(__dirname, "views", "about.html");
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("ALL ABOUT ME");
    }
  });
});

//display all legos
app.get("/lego/sets", (req, res) => {
  legoData
    .getAllSets()
    .then((sets) => {
      res.send(sets);
      console.log("Showing all LEGO sets");
    })
    .catch((error) => {
      console.error("No LEGO for YOU!", error.message);
      res.status(404).send("No LEGO for YOU!");
    });
});

//display sets by search
app.get("/lego/:sets", (req, res) => {
  const theme = req.query.theme;
  legoData
    .getSetsByTheme(theme)
    .then((sets) => {
      res.send(sets);
      console.log("Showing LEGO sets by Theme");
    })
    .catch((error) => {
      console.error("No LEGO for YOU!", error.message);
      res.status(404).send("No LEGO for YOU!");
    });
});

//display lego by number
app.get("/lego/sets/:setNum", (req, res) => {
  const setNum = req.params.setNum;
  legoData
    .getSetByNum(setNum)
    .then((set) => {
      res.send(set);
      console.log("Showing LEGO sets by Num");
    })
    .catch((error) => {
      console.error("No LEGO for YOU!", error.message);
      res.status(404).send("No LEGO for YOU!");
    });
});

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});
