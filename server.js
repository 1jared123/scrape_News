//Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");


var router = express();
var PORT = process.env.PORT || 7526;

//Serve static content from public directory
router.use(express.static(process.cwd() + "/public"));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.text());
router.use(bodyParser.json({ type: "application/vnd.api+json" }));

router.use(logger("dev"));
router.use(bodyParser.urlencoded({
  extended: false
}));

//Setting up Handlebars
var exphbs = require("express-handlebars");

//Adding Partial Directory
var hbs = exphbs.create({
    defaultLayout: "main",
    partialsDir: ["views/partials/"]
});

router.engine("handlebars", hbs.engine);
router.set("view engine", "handlebars");

//Importing routes
var opinions = require("./controllers/news_controller.js");

router.use("/", opinions);


router.listen(PORT, function() {
    console.log("Server Operational - Listening to Port " + PORT);
});


