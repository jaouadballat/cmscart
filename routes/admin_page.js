const express = require('express');
const slugify = require('slugify');
const Page = require('../models/pages');
const swal = require('sweetalert2');
const router = express.Router();

/* GET pages listing. */
router.get('/', function(req, res, next) {
  Page.find({}, function(err, pages) {
    if(err) return console.log(err);
    res.render('admin/pages', {
      title: "pages",
      pages: pages
    });
  });
});

router.get('/add-page', function(req, res) {
  res.render('admin/add-page', {title:"add page"});
});

router.post('/add-page', function(req, res) {
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('content', 'Content is required').notEmpty();
  const errors = req.validationErrors();
  if(errors) {
    res.render('admin/add-page', {
      errors: errors,
      title: "add page"
    });

  }else {
    const title =req.body.title;
    const content =req.body.content;
    const slug = slugify(req.body.title);
    Page.findOne({slug: slug}, function(err, page){
      if(page) {
        const errors = [];
        errors.push({
          msg: "This slug is already taken please choose one"
        });
        res.render('admin/add-page', {
          title: "add page",
          errors: errors
        });
      }else {
          const page = new Page({
            title: title,
            slug: slug, 
            content: content
          });
          page.save(function (err, page) {
            if (err) {
              console.log(err)
            } else {
              res.redirect('/admin/pages');
            }
          });
      }
    });
  }
});

router.get('/edit-page/:slug', function(req, res) {
  Page.findOne({slug: req.params.slug}, function(err, page) {
    if (err) {
       console.log(err)
    }
    else{
      res.render('admin/edit-page', {
        slug: page.slug,
        content: page.content,
        title: page.title,
        id: page._id
      });
    }
  });
  
});

router.post('/update-page', function(req, res) {
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('content', 'Content is required').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    res.render('admin/add-page', {
      errors: errors,
      title: "add page"
    });
  }else{
    const title = req.body.title;
    const slug = slugify(req.body.slug);
    const content = req.body.content;
    const id = req.body.id;
    Page.findOne({slug: slug , _id: {$ne: id}}, function(err, page) {
      if(err) return console.log(err);
      if(page) {
        
          const errors = [];
          errors.push({
            msg: "This slug is already taken please choose one"
          });
          res.render('admin/edit-page', {
            id: id,
            title: title,
            content: content,
            slug: slug,
            errors: errors
          });
      }else {
        Page.findByIdAndUpdate(id, {$set: {
          title: title,
          content: content,
          slug: slug,
        }}, function(err){
          if(err) return console.log(err);
          res.redirect('/admin/pages');
        });
      }
    });
  }
});

router.post('/delete-page', function(req, res) {
  const id = req.body.id;
  Page.findByIdAndRemove(id, function(err) {
    if (err) return console.log(err);
      res.redirect('/admin/pages');
  });
});

module.exports = router;
