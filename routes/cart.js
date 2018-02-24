const express = require('express');
const Product = require('../models/products');
// const Category = require('../models/categories');

const router = express.Router();

/* GET categories listing. */
router.get('/', function (req, res, next) {
    // Product.find(function (err, products) {
    //     if (err) return console.log(err);
    //     res.render('products', {
    //         title: "products",
    //         products: products
    //     });
    // });
});

router.get('/add/:product', function (req, res) {
    Product.findById(req.params.product, function (err, product) {
        if (err) return console.log(err);
        if(req.session.cart === undefined) {
            req.session.cart = [];
            req.session.cart.push({
                id: product._id,
                title: product.title,
                qty: 1,
                image: product.image,
                price: product.price
            });
        }else{
            let newProduct = true;
            req.session.cart.map(item => {
                if(product._id == item.id){
                    item.qty++;
                    newProduct = false;
                }
            })

            if(newProduct) {
                req.session.cart.push({
                        id: product._id,
                        title: product.title,
                        qty: 1,
                        image: product.image,
                        price: product.price
                    });
            }
        }
        res.redirect('back');
    });
});


module.exports = router;
