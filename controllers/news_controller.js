//Dependencies
var express = require("express");
var router = express.Router();
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var logger = require("morgan");
var bodyParser = require("body-parser");

mongoose.Promise = Promise;


// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

router.use(logger("dev"));
router.use(bodyParser.urlencoded({
  extended: false
}));

// Initialize Express
var router = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

//here the connection to mongodb for heroku.
mongoose.connect("mongodb://heroku_qtbdcbjr:ja43ehb1en1e4m63qv85rlhmc7@ds161121.mlab.com:61121/heroku_qtbdcbjr");
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

//get the comments linked to an article
router.get("/articles/:id", function(req, res) {
  Article.findOne({"_id":req.params.id}).populate("note").exec(function(error, work) {
    if (error) {
      res.send(error);
    }
    else {
      res.json(work);
    }
  })

});

//remove a comment
router.post("/remove/:id", function(req, res) {
  Note.findOneAndRemove({ "_id":req.params.id}, function(err, todo) {
    var response = {
      message: "Comment successfully deleted",
      id: todo._id
    }
     res.send("done")
  })

})


//save a comment to an article.
router.post("/articles/:id", function(req, res) {

  var newNote = new Note(req.body);

// Save the new book in the books collection
  newNote.save(function(err, doc) {
    // Send an error to the browser if there's something wrong
    if (err) {
      console.log(err);
    }
    // Otherwise...
    else {
        Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "note": doc._id } }, { new: true }).exec(function(error, doc) {
        // Send any errors to the browser
        if (error) {
          res.send(error);
        }
        // Or send the doc to the browser
        else {
          res.send(doc);
        }
      });
    }
  });

});

// Scrape data from espn and place it into the mongodb db
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
  res.redirect("/all");
});

module.exports = router;