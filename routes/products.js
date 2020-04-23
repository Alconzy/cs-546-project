const express = require('express');
const router = express.Router();
const productData = require('../data').products;
const userData = require('../data').users;
const commentData = require('../data').comments;

// add product
router.get("/add", async (req, res) => {
    res.render('addproduct', {});
});

router.post("/add", async (req, res) => {
    let product = req.body;
    await productData.addProduct(product);
    res.render('addproduct', {info: 'Add product success!'});
});

// find the product by id
router.get("/detail/:id", async (req, res) => {
    let id = req.params.id;
    let product = await productData.getProductById(id);
    let comments = await commentData.getCommentByProduct(id);
    res.render('detail', {
        'product': product,
        'comments': comments
    });
});

// filter product
router.get("/category/:class", async (req, res) => {
    let category = req.params.class;
    let products = await productData.getAllProduct();
    products = products.filter(function (product) {
        return product.tags === category;
    });

    res.render('category', {
        "products": products
    });
});

// search product
router.post("/search", async (req, res) => {
    let searchKeyword = req.body.searchKeyword;
    let products = await productData.searchProducts(searchKeyword);
    console.log(products);
    res.render('category', {
        "products": products
    });
});

// cart page
router.get("/cart", async (req, res) => {
    let products = [];
    for (let i = 0; i < req.session.user.cart.length; i++) {
        let id = req.session.user.cart[i];
        let product = await productData.getProductById(id);
        products.push(product);
    }

    // calculate total money
    let money = 0;
    products.forEach(function (product, index) {
        money += Number.parseFloat(product.price);
    });
    res.render('cart', {
        'products': products,
        'money': money
    });
});

// delete product from cart
router.get("/cart/delete/:id", async (req, res) => {
    let id = req.params.id;
    let cart = req.session.user.cart;
    let index = cart.indexOf(id);
    req.session.user.cart.splice(index, 1);
    await userData.updateUser(req.session.user);
    res.redirect('/products/cart');
});

// payment
router.get("/payment/:money", async (req, res) => {
    let money = req.params.money;
    res.render('payment', {
        'money': money
    })
});

// return order page
router.get("/orderPage", async (req, res) => {
    let products = [];
    for (let i = 0; i < req.session.user.orderHistory.length; i++) {
        let id = req.session.user.orderHistory[i];
        let product = await productData.getProductById(id);
        products.push(product);
    }
    res.render('order', {
        'products': products
    });
});

// order and then clear cart
router.get("/order", async (req, res) => {
    // update order history
    let order = req.session.user.orderHistory.concat(req.session.user.cart);
    req.session.user.orderHistory = order;
    await userData.updateUser(req.session.user);

    // descent the stocks
    for (let i = 0; i < req.session.user.cart.length; i++) {
        let id = req.session.user.cart[i];
        let product = await productData.getProductById(id);
        await productData.updateProductStockRemaining(id, Number.parseInt(product.stocks) - 1);
    }
    req.session.user.cart = [];

    // find all products in order history
    let products = [];
    for (let i = 0; i < req.session.user.orderHistory.length; i++) {
        let id = req.session.user.orderHistory[i];
        let product = await productData.getProductById(id);
        products.push(product);
    }

    res.render('order', {
        'products': products
    });
});

router.get("/order/delete/:id", async (req, res) => {
    let id = req.params.id;
    let order = req.session.user.orderHistory;
    let index = order.indexOf(id);
    req.session.user.orderHistory.splice(index, 1);
    await userData.updateUser(req.session.user);
    res.redirect('/products/order');
});
module.exports = router;
