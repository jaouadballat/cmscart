const express = require('express');
const slugify = require('slugify');
const Category = require('../models/categories');
const Product = require('../models/products');
const path = require('path');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/Tutorials/Ecommerce/public/images')
    },
    filename: function (req, file, cb) {
        
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const fileFilter = function (req, file, cb) {

    const filetypes = /jpeg|jpg/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }

    cb("Error: File upload only supports the following filetypes - " + filetypes);

    
}

const upload = multer({ storage: storage, fileFilter: fileFilter }).single('image');



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

router.post('/add-product', function (req, res) {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('price', 'Price is required').notEmpty();
    req.checkBody('description', 'Content is required').notEmpty();
    let errors = req.validationErrors();
    if(errors) {
        Category.find(function (err, categories) {
            res.render('admin/add-product', {
                title: "add product",
                errors: errors,
                categories: categories
            });
        });
    }else {
        upload(req, res, function (err) {
            errors= [];
            if (err) {
                // An error occurred when uploading
                errors.push({
                    msg: err
                });
                Category.find(function (err, categories) {
                    res.render('admin/add-product', {
                        title: "add product",
                        errors: errors,
                        categories: categories
                    });
                });

            } else {
                // let product = new Product({
                //     title: req.body.title,
                //     category: req.body.category,
                //     price: req.body.price,
                //     description: req.body.description,
                //     image: req.file.filename
                // });
                res.send(req.body)
                //res.redirect('/admin/products/add-product');
                // Everything went fine

            }
        });
    }
    
});

router.get('/add-product', function (req, res) {
    Category.find(function(err, categories) {
        if(err) return console.log(err);
        res.render('admin/add-product',
         { 
             title: "add category",
            categories: categories
         });
    });
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
