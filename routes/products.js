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

// find the product by id
router.get("/detail/:id", async (req, res) => {

    try {
        let id = req.params.id;
        let product = await productData.getProductById(id);
        let comments = await commentData.getCommentByProduct(id);
        res.render('detail', {
            'product': product,
            'comments': comments
        });
    } catch (e) {
        res.status(400).json({ "err": 1, "msg": e.message });
    }
});

// filter product
router.get("/category/:class", async (req, res) => {

    try {
        let category = req.params.class;
        let products = await productData.getAllProduct();
        products = products.filter(function (product) {
            return product.tags === category;
        });

        res.render('category', {
            "products": products
        });
    } catch (e) {
        res.status(400).json({ "err": 1, "msg": e.message });
    }
});

// search product
router.post("/search", async (req, res) => {

    try {
        let searchKeyword = req.body.searchKeyword;
        let products = await productData.searchProducts(searchKeyword);
        console.log(products);
        res.render('category', {
            "products": products
        });
    } catch (e) {
        res.status(400).json({ "err": 1, "msg": e.message });
    }
});

// cart page
router.get("/cart", async (req, res) => {

    try {
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
        res.render('payment', {
            'money': money
        });
    } catch (e) {
        res.status(400).json({ "err": 1, "msg": e.message });
    }
});

// return order page
router.get("/orderPage", async (req, res) => {

    try {
        let products = [];
        for (let i = 0; i < req.session.user.orderHistory.length; i++) {
            let id = req.session.user.orderHistory[i];
            let product = await productData.getProductById(id);
            products.push(product);
        }
        res.render('order', {
            'products': products
        });
    } catch (e) {
        res.status(400).json({ "err": 1, "msg": e.message });
    }
});

// order and then clear cart
router.get("/order", async (req, res) => {
    try {

        // descent the stocks
        for (let i = 0; i < req.session.user.cart.length; i++) {
            let id = req.session.user.cart[i];
            let product = await productData.getProductById(id);
            await productData.updateProductStockRemaining(id, Number.parseInt(product.stocks) - 1);
            await productData.productSellCount(id, Number.parseInt(product.sellCount) + 1);
        }

        // update order history
        let order = req.session.user.orderHistory.concat(req.session.user.cart);
        req.session.user.orderHistory = order;
        req.session.user.cart = [];
        await userData.updateUser(req.session.user);

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
    } catch (e) {
        res.status(400).json({ "err": 1, "msg": e.message });
    }
});

router.get("/order/delete/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let order = req.session.user.orderHistory;
        let index = order.indexOf(id);
        req.session.user.orderHistory.splice(index, 1);
        await userData.updateUser(req.session.user);
        res.redirect('/products/order');
    } catch (e) {
        res.status(400).json({ "err": 1, "msg": e.message });
    }
});

// random sort the array
function randomSort(a, b) {
    return Math.random()>.5 ? -1 : 1;
}
/**
 * CarouselList access the carousel ’product’ in main page, 
 * and then return json string, because Ajax requires js get json data from server, 
 * therefore we need to add as well as modify some methods to return res.json() which return the json data result of query.
 */
router.get('/carouselList', async (req, res) => {
    let products = await productData.getAllProduct();
    products = products.sort(randomSort);

    let carouselList = products.splice(0, 5);

    res.json({"carouselList": carouselList});
});

// filter by high to low / low to high price and color 
router.post("/productFilter", async (req, res) => {
    try {
        // req.body.color  Should be array
        let product = await productData.productFilter(req.body.tag, req.body.filter, req.body.color)
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
        })
        res.json({ "product": product_data })
    } catch (e) {
        res.json({ "product": [] })
    }
});

module.exports = router;