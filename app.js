const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

////////////////// Requests targeting all articles ///////////////////////

app.route("/articles")

  .get(function(req, res) { //Get all Articles using RESTful API
    Article.find({}, function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) { //Post A new article from the client (1 Artice), using RESTful API
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added new article!");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) { //Delete all articles from DB using RESTful API
    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send("Successfully deleted all articles o_o");
      } else {
        res.send(err);
      }
    });
  });


/////////////////// Requests targeting a SPECIFIC article ///////////////////
app.route("/articles/:articleTitle")
  .get(function(req, res) { //Get specific article

    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found.");
      }
    });
  })
  .put(function(req, res) { //Replace specific article (overwrites)
    Article.updateOne({
      title: req.params.articleTitle
    }, {
      title: req.body.title,
      content: req.body.content
    }, {
      overwrite: true
    }, function(err) {
      if (!err) {
        res.send("Successfully updated article.");
      }
    });
  })

  .patch(function(req, res) { //Update specific article
    Article.updateOne({
      title: req.params.articleTitle
    }, {
      $set: req.body
    }, function(err) {
      if (!err) {
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) { //Delete specific article
    Article.deleteOne({
      title: req.params.articleTitle
    }, function(err) {
      if (!err) {
        res.send("Article was deleted successfully.");
      } else {
        res.send(err);
      }
    });
  });


app.listen("3000", function() {
  console.log("Server has started successfully");
});