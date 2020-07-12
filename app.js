const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/wikiDb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const articlesSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articlesSchema);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.route("/articles").get(function (req, res) {
  Article.find(function (err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }

  })
}).post(function (req, res) {
  const newTitle = req.body.title;
  const newContent = req.body.content;
  const newArticle = new Article({
    title: newTitle,
    content: newContent
  });
  newArticle.save(function (err) {
    if (!err) {
      res.send("Successfully added the article");

    } else {
      res.send(err);
    }
  });
}).delete(function (req, res) {
  Article.deleteMany(function (err) {
    if (!err) {
      res.send("Successfully deleted all articles");
    } else {
      res.send(err);
    }
  })
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("Specified article not found!");
    }
  })
})
.put(function(req,res){
  Article.update(
    {title:req.params.articleTitle},
    {title:req.body.title, content:req.body.content},
    {overwrite:true},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      }
    }
  )
})
.patch(function(req,res){
  Article.update(
    {title:req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Document updated Success");
      }
    }
  )
})
.delete(function(req,res){
  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Document delete success");
      }
    }
  )
});
app.listen(3000, function () {
  console.log("Server started on port 3000");
});