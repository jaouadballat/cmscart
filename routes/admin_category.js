const express = require('express');
const slugify = require('slugify');
const Category = require('../models/categories');
const router = express.Router();

/* GET categories listing. */
router.get('/', function (req, res, next) {
    Category.find({}, function (err, categories) {
        if (err) return console.log(err);
        res.render('admin/categories', {
            title: "categories",
            categories: categories
        });
    });
});

router.get('/add-category', function (req, res) {
    res.render('admin/add-category', { title: "add category" });
});

router.post('/add-category', function (req, res) {
    req.checkBody('title', 'Title is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.render('admin/add-page', {
            errors: errors,
            title: "add category"
        });

    } else {
        const title = req.body.title;
        const slug = slugify(req.body.title);
        Category.findOne({ slug: slug }, function (err, category) {
            if (category) {
                const errors = [];
                errors.push({
                    msg: "This title is already taken please choose one"
                });
                res.render('admin/add-category', {
                    title: "add category",
                    errors: errors
                });
            } else {
                const category = new Category({
                    title: title,
                    slug: slug,
                });
                category.save(function (err) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.redirect('/admin/categories');
                    }
                });
            }
        });
    }
});

router.get('/edit-category/:slug', function (req, res) {
    Category.findOne({ slug: req.params.slug }, function (err, category) {
        if (err) {
            console.log(err)
        }
        else {
            res.render('admin/edit-category', {
                slug: category.slug,
                title: category.title,
                id: category._id
            });
        }
    });

});

router.post('/update-category', function (req, res) {
    req.checkBody('title', 'Title is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.render('admin/add-category', {
            errors: errors,
            title: "add category"
        });
    } else {
        const title = req.body.title;
        const slug = slugify(req.body.title);
        const id = req.body.id;
        Category.findOne({ slug: slug, _id: { $ne: id } }, function (err, category) {
            if (err) return console.log(err);
            if (category) {
                const errors = [];
                errors.push({
                    msg: "This slug is already taken please choose one"
                });
                res.render('admin/edit-category', {
                    id: id,
                    title: title,
                    slug: slug,
                    errors: errors
                });
            } else {
                Category.findByIdAndUpdate(id, {
                    $set: {
                        title: title,
                        slug: slug
                    }
                }, function (err) {
                    if (err) return console.log(err);
                    res.redirect('/admin/categories');
                });
            }
        });
    }
});

router.post('/delete-category', function (req, res) {
    const id = req.body.id;
    Category.findByIdAndRemove(id, function (err) {
        if (err) return console.log(err);
        res.redirect('/admin/categories');
    });
});

module.exports = router;
