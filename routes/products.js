const express = require('express');
const slugify = require('slugify');
const Product = require('../models/products');
const Category = require('../models/categories');

const router = express.Router();

/* GET categories listing. */
router.get('/', function (req, res, next) {
    Product.find(function (err, products) {
        if (err) return console.log(err);
        res.render('products', {
            title: "products",
            products: products
        });
    });
});

router.get('/:category', function (req, res) {
    Category.findById(req.params.category, function(err, cat) {
        if(err) return console.log(err);
        Product.find({ category: req.params.category }, function (err, products) {
            if (err) return console.log(err);
            res.render('products', {
                title: cat.title,
                products: products
            });
        });
    });
});

router.get('/:category/:product', function(req, res) {
    Product.findById(req.params.product, function(err, product) {
        if(err) return console.log(err);
        res.render('product', {
            title: product.title,
            product: product
        });
    });
});

module.exports = router;
