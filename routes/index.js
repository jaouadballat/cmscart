var express = require('express');
var router = express.Router();
const Page = require('../models/pages');
const Category = require('../models/categories');


router.get('/', function(req, res, next) {
  
 
    res.redirect('/products')
});

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
