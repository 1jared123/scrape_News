//Dependencies
var express = require("express");
var router = express.Router();
var mongojs = require("mongojs");
var mongoose = require("mongoose");


// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

var Note = require("../models/Note.js");
var Article = require("../models/Article.js");


// Initialize Express
var router = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];


mongoose.connect("mongodb://localhost/scrape_news");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});




// Main route (simple Hello World Message)
router.get("/", function(req, res) {
  res.redirect("/all")
});

// Retrieve data from the db
router.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  Article.find({}, function(error, results) {
      if (error) {
        res.send(error);
      }
      else {
        res.render("dashboard", { article: results });
      }
    })
});

// Scrape data from one site and place it into the mongodb db
router.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("http://www.espn.com/college-football/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("article section").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).find("h1").text();
      result.link = $(this).find("a").attr("href");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });
  });
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");
});

module.exports = router;