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
    
    Product.find({}, function (err, products) {
        if (err) return console.log(err);
        res.render('admin/products', {
            title: "products",
            products: products
        });
    });
});

router.post('/add-product', function (req, res) {
    
        upload(req, res, function (err) {
           
           let errors= [];
            if (err) {
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
                req.checkBody('title', 'Title is required').notEmpty();
                 req.checkBody('price', 'Price is required').notEmpty();
                req.checkBody('description', 'Content is required').notEmpty();
                errors = req.validationErrors();
                if(errors) {
                    Category.find(function (err, categories) {
                        res.render('admin/add-product', {
                            title: "add product",
                            errors: errors,
                            categories: categories
                        });
                    });
                }else {
                    let product = new Product();
                    product.title = req.body.title;
                    product.category = req.body.category;
                    product.price = req.body.price;
                    product.description = req.body.description;
                    if(req.file) {
                        product.image = '/images/' + req.file.filename;
                    }else {
                        product.image = '/images/no-product-image.png';
                    }
                    product.save(function (err) {
                        if (err) return console.log(err);
                        res.redirect('/admin/products/add-product');
                    });                    
                }
            }
        });
    
    
});

router.post('/update-product/:id', function (req, res) {

    upload(req, res, function (err) {

        let errors = [];
        if (err) {
            errors.push({
                msg: err
            });
            Product.findById(req.params.id, function(err, product) {
                Category.find(function (err, categories) {
                    res.render('admin/edit-product', {
                        title: "edit product",
                        errors: errors,
                        product: product,
                        categories: categories
                    });
                });
            });
            

        } else {
            req.checkBody('title', 'Title is required').notEmpty();
            req.checkBody('price', 'Price is required').notEmpty();
            req.checkBody('description', 'Content is required').notEmpty();
            errors = req.validationErrors();
            if (errors) {
                Product.findById(req.params.id, function (err, product) {
                    Category.find(function (err, categories) {
                        res.render('admin/edit-product', {
                            title: "edit product",
                            errors: errors,
                            product: product,
                            categories: categories
                        });
                    });
                });
            } else {
                Product.findById(req.params.id, function(err, product) {
                    product.title = req.body.title;
                    product.category = req.body.category;
                    product.price = req.body.price;
                    product.description = req.body.description;
                    if (req.file) {
                        product.image = '/images/' + req.file.filename;
                    } 
                    product.save(function (err) {
                        if (err) return console.log(err);
                        res.redirect('/admin/products');
                    });
                });
            }
        }
    });


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

router.get('/edit-product/:id', function (req, res) {
    Product.findOne({ _id: req.params.id }, function (err, product) {
        if (err) {
            console.log(err)
        }
        else {
            Category.find(function(err, categories){
                if (err) return console.log(err);
                res.render('admin/edit-product', {
                    title: "edit product",
                    product: product,
                    categories: categories
                });
            });
        }
    });

});


router.post('/delete-product/:id', function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) return console.log(err);
        res.redirect('/admin/products');
    });
});

module.exports = router;
