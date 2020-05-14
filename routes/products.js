const express = require('express');
const router = express.Router();
const productData = require('../data').products;
const userData = require('../data').users;
const commentData = require('../data').comments;

//Add Product
router.post("/add", async (req, res) => {

    try {
        let product = req.body;
        await productData.addProduct(product);
        res.render('addproduct', { info: 'Add product success!' });
    } catch (e) {
        res.status(400).json({ "err": 1, "msg": e.message });
    }
});

router.get("/detail/:id", async (req, res) => {
    res.render('detail');
});

// find the product by id
router.get("/detail/product/:id", async (req, res) => {
    let id = req.params.id;
    let product = await productData.getProductById(id);
    res.json(product);
});

router.get("/detail/comments/:id", async (req, res) => {
    let id = req.params.id;
    let comments = await commentData.getCommentByProduct(id);
    res.json(comments);
});

// filter product
router.get("/category/:class", async (req, res) => {
    res.render('category');
});

// filter product
router.get("/category_list/:class", async (req, res) => {
    let category = req.params.class;
    let products = await productData.getAllProduct();
    products = products.filter(function (product) {
        return product.tags === category;
    });

    res.json({"products": products});
});

// search product
router.post("/search", async (req, res) => {
    
    try {
        let searchKeyword = req.body.searchKeyword;
        let products = await productData.searchProducts(searchKeyword);
        console.log(products);
        res.render('search', {
            "products": products
        });
    } catch (e) {
        res.status(400).json({ "err": 1, "msg": e.message });
    }
});

// cart page
router.get("/cart", async (req, res) => {

    try{
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
            'money': money,
            'orderCount': req.session.user.cart.length
        });
    } catch (e) {
    res.status(400).json({ "err": 1, "msg": e.message });
    }
});

// delete product from cart
router.get("/cart/delete/:id", async (req, res) => {
    
    try {
        let id = req.params.id;
        let cart = req.session.user.cart;
        let index = cart.indexOf(id);
        req.session.user.cart.splice(index, 1);
        await userData.updateUser(req.session.user);
        res.redirect('/products/cart');
    } catch (e) {
        res.status(400).json({ "err": 1, "msg": e.message });
    }
});

// payment
router.get("/payment/:money", async (req, res) => {
    
    try {
        let money = req.params.money;
        let paymentInfo = req.session.user.paymentInfo;
        let payment = false;
        if (paymentInfo.length > 0) {
            payment = true
        }
        res.render('payment', {
            'money': money,
            'payment': payment
        });
    } catch (e) {
        res.status(400).json({ "err": 1, "msg": e.message });
    }
});

// return order page
router.get("/orderPage", async (req, res) => {
    res.render('order');
});

router.get("/orderProduct", async (req, res) => {
    let products = [];
    for (let i = 0; i < req.session.user.orderHistory.length; i++) {
        let id = req.session.user.orderHistory[i];
        let product = await productData.getProductById(id);
        products.push(product);
    }
    res.json(products);
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

// filter by high to low / low to high price and color 
router.post("/productFilter", async (req, res) => {
    try {
        // req.body.color  Should be array
        let product = await productData.productFilter(req.body.tag, req.body.filter, req.body.color);
        res.render('category', {
            "products": product
        });
    } catch (e) {
        res.status(400).json({ "err": 1, "msg": e.message });
    }
});

router.get("/productGraph", async (req, res) => {
    try {
        let product = await productData.productGraph()
        res.render('productGraph')
    } catch (e) {
        res.status(400).json({ "err": 1, "msg": e.message });
    }
});

router.get("/Graph", async (req, res) => {
    try {
        let product = await productData.productGraph();
        var product_data = [];
        product.forEach(element => {

            product_data.push({
                x: element.name,
                y: element.sellCount
            })
        });
        res.json({ "product": product_data })
    } catch (e) {
        res.json({ "product": [] })
    }
});

// random sort the array
function randomSort(a, b) {
    return Math.random()>.5 ? -1 : 1;
}

router.get('/carouselList', async (req, res) => {
    let products = await productData.getAllProduct();
    products = products.sort(randomSort);

    let carouselList = products.splice(0, 5);
    res.json({"carouselList": carouselList});
});

router.get("/all", async (req, res) => {
    try {
         let products = await productData.getAllProduct();
         res.json({ "product": products });
     } catch (e) {
        res.json({ "product": [] })
    }
});
module.exports = router;