//Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

var app = express();
var PORT = process.env.PORT || 7526;

//Serve static content from public directory
app.use(express.static(process.cwd() + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

//Setting up Handlebars
var exphbs = require("express-handlebars");

//Adding Partial Directory
var hbs = exphbs.create({
    defaultLayout: "main",
    partialsDir: ["views/partials/"]
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

//Importing routes
var opinions = require("./controllers/news_controller.js");

app.use("/", opinions);

//Default Page for all unknown url
app.get("*", function(req, res) {
	res.redirect("/404");
});

app.listen(PORT, function() {
    console.log("Server Operational - Listening to Port " + PORT);
});
