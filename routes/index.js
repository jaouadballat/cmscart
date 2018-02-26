var express = require('express');
var router = express.Router();
const Page = require('../models/pages');
const Category = require('../models/categories');


router.get('/', function(req, res, next) {
  
  // Page.find(function (err, pages) {
  //   if (err) return console.log(err);
  //   req.app.locals.pages = pages;
    res.render('index', {
      title: 'home',
      content: "home page"
    });
  });
// });

router.get('/:slug', function(req, res) {
  Page.findOne({slug: req.params.slug}, function(err, page){
    if (err) console.log(err);
      if(!page) {
        res.redirect('/');
      }else {
        res.render('index', {
          title: page.title,
          content: page.content
        });
      }
  });
});


module.exports = router;
