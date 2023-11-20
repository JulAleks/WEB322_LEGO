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

const express = require("express");
const app = express();
const path = require("path");
const HTTP_PORT = 8080;
const legoData = require("./modules/legoSets");

////////////////////////////////////////////////

// set the view engine to EJS
app.set("view engine", "ejs");

// static files from the public directory
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

///////////// INIT ALL LEGOS/////////////////////////
// init LEGO data
legoData
  .initialize()
  .then(() => {
    console.log("LEGO data initialized!");
  })
  .catch((error) => {
    console.error("No LEGO for YOU!", error.message);
    res.status(404).render("404", {
      message:
        "Apologies, but it seems the raccoons have orchestrated a LEGO heist, leaving your digital bricks in the paws of mischief, rendering initialization impossible - those crafty bandits are building their own raccoon metropolis! ",
    });
  });

///////PAGES////////////

//home page
app.get("/", (req, res) => {
  res.render("home", { page: "home" });
  console.log("This is HOMEPAGE");
});

// about
app.get("/about", (req, res) => {
  res.render("about", { page: "about" });
  console.log("ALL ABOUT ME");
});

///////GETTING ALL LEGOS/////////////////////////////

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
            "Oops! Those raccoons strike again – this time, they've pulled a vanishing act on the LEGO themes, leaving behind a trail of paw prints and tiny masks as their signature style; looks like they're going for a minimalist, raccoon-approved design!",
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
          message: `Apologies, but the raccoons orchestrated a LEGO upheaval, engaging in a spirited game of "Brick Jenga," and now the sets are in delightful chaos - looks like they've embraced a new avant-garde architectural style!`,
        });
      });
  }
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
          "Uh-oh! It appears the mischievous Halloween raccoons snatched all the numbers, leaving your LEGO set lost in the numerical abyss – seems they're on a mission to create a spooky code for a haunted brick dimension!",
      });
    });
});

//////ADD NEW SET//////////////////////

// get lego themes to add set
app.get("/lego/addSet", (req, res) => {
  Promise.all([legoData.getAllSets(), legoData.getThemes()])
    .then(([sets, themes]) => {
      res.render("addSet", { page: "addSet", sets: sets, themes: themes });
      console.log("addSet");
    })
    .catch((error) => {
      console.error("No LEGO for YOU!", error.message);
      res.status(404).render("404", {
        message:
          "Apologies, it seems the raccoons transformed the LEGO display into a whimsical raccoon playground, complete with makeshift rollercoasters and acorn-shaped skyscrapers, rendering the sets temporarily unavailable for human eyes!",
      });
    });
});

//posting new set
app.post("/lego/addSet", (req, res) => {
  const setData = req.body;
  legoData
    .addSet(setData)
    .then(() => {
      res.redirect("/lego/sets");
    })
    .catch((err) => {
      console.error("Error adding LEGO set:", err);
      res.status(500).render("500", {
        message:
          "Oops! The raccoons got a bit carried away with their artistic flair and turned the new LEGO set posting into a scavenger hunt – good luck finding all the pieces scattered around their mischievous raccoon masterpiece",
      });
    });
});

/////////////////EDIT/DELETE///////////////////////
//edit set
app.get("/lego/editSet/:setNum", (req, res) => {
  const setNum = req.params.setNum;

  legoData
    .getSetByNum(setNum)
    .then((specificSet) => {
      return Promise.all([
        Promise.resolve(specificSet),
        legoData.getAllSets(),
        legoData.getThemes(),
      ]);
    })
    .then(([specificSet, allSets, themes]) => {
      res.render("editSet", {
        set: specificSet,
        allSets: allSets,
        themes: themes,
      });
      console.log("Showing LEGO set by Num");
    })
    .catch((error) => {
      if (error !== "Set not found") {
        console.error("Error fetching LEGO set:", error.message);
        res.status(500).render("500", {
          message: `Whoopsie-daisy! Looks like the mischievous raccoons sneaked into the digital LEGO realm and absconded with the blueprint, leaving behind a note that says, "We needed more bricks for our secret treehouse—sorry, not sorry!"`,
        });
      }
    });
});

//post
app.post("/lego/editSet/:setNum", (req, res) => {
  const setNum = req.params.setNum;
  const setData = req.body;
  legoData
    .editSet(setNum, setData)
    .then(() => {
      res.redirect("/lego/sets");
    })
    .catch((err) => {
      console.error("Error adding LEGO set:", err);
      res.status(500).render("500", {
        message: `Uh-oh! It seems the raccoons got into the code and declared a "Paws on, No Editing" policy, demanding a LEGO set makeover with mandatory trash can hideouts and a secret society of masked brick bandits!`,
      });
    });
});

//delete
app.get("/lego/deleteSet/:setNum", (req, res) => {
  const setNum = req.params.setNum;
  legoData
    .deleteSet(setNum)
    .then(() => {
      res.redirect("/lego/sets/");
    })
    .catch((err) => {
      console.error("Error deleting LEGO set:", err);
      res.status(500).render("500", {
        message:
          "The LEGO set deletion error has triggered a riot of protesting raccoons demanding equal brick rights and a promise of a deluxe LEGO mansion in return for a ceasefire",
      });
    });
});

///////ERRORS//////////

// 404 errors
app.get("*", (req, res) => {
  res.status(404).render("404", {
    message:
      "I'm sorry, ninja raccoons made it impossible to see, just like the page you were looking for.",
  });
});

// 500 errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", {
    message:
      "Oops! Ninja raccoons ambushed our servers. Sending in tech-savvy squirrels for damage control. Enjoy some acrobatic raccoon memes while we sort this out!",
  });
});

//app listen
app.listen(HTTP_PORT, () => {
  console.log(
    "Server is all set on  " +
      HTTP_PORT +
      ", just beware of raccoons in the code!"
  );
});
