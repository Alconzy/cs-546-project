const usersRoutes = require("./users");
const productsRoutes = require("./products");
const commentsRoutes = require('./comments');
const adminRoutes = require('./admin');
const data = require('../data');
const productData = data.products;

// random sort the array
function randomSort(a, b) {
  return Math.random()>.5 ? -1 : 1;
}

const constructorMethod = app => {
  app.use("/users", usersRoutes);
  app.use("/products", productsRoutes);
  app.use("/comments", commentsRoutes);
  app.use("/admin", adminRoutes);

  app.get("/*.html", async (req, res) => {
    let url = req.originalUrl;
    let page = url.substring(1, url.length-5);
    res.render(page);
  });

  app.use("/", async(req, res) => {
    let products = await productData.getAllProduct();
    products = products.sort(randomSort);

    let carouselList = products.splice(0, 5);

    app.locals.sess = req.session;

    res.render('index', {
      'carouselList':carouselList,
      'products': products,
      'sess': req.session
    });
  });
};

module.exports = constructorMethod;