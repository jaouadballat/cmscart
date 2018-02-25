const express = require('express');
const Product = require('../models/products');
const stripe = require("stripe")("sk_test_bSlBjwlbWBzNzmRUXsbhFaVY");

// const Category = require('../models/categories');

const router = express.Router();

/* GET categories listing. */
router.get('/checkout', function (req, res, next) {
    const products = req.session.cart;
    res.render('checkout', {
        title: "Checkout",
        products: products
    });
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
            let item = req.session.cart.find(item => {
                return item.id == product._id;
            });

            if(item) {
                item.qty++;
            }else {
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

router.get('/update/:product', function(req,res,next) {
    let action = req.query.action;
    let product = req.session.cart.find(item => {
        return item.id == req.params.product;
    });
   let index =  req.session.cart.indexOf(product);
    switch (action) {
        case 'add':
            product.qty++;
            break;
        case 'min':
            product.qty--;
            if(product.qty < 1){
                req.session.cart.splice(index, 1)
            }
            break;
        case 'clear':
            req.session.destroy();
            res.redirect('/cart/checkout');
            break;
        default:
        res.redirect('back');
            break;
    }
    res.redirect('back');
});

router.get('/cancel', function(req, res, next) {
    res.redirect('/products');
});

router.post('/checkout', function(req, res, next) {
    const total = req.query.total;
    const token = req.body.stripeToken; // Using Express
    // Charge the user's card:
    stripe.charges.create({
        amount: total*100,
        currency: "usd",
        description: "Example charge",
        source: token,
    }, function (err, charge) {
        req.session.destroy();
        res.render('thankyou', {
            title: 'checkout',
            email: req.body.stripeEmail
        });
    });
});


module.exports = router;
