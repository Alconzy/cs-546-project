const dbConnection = require("./mongoConnection");

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);

      //  create db index
      if (collection === 'users') {
        _col.createIndex({email: 1}, {unique: true});
      } else if (collection === 'products') {
        _col.createIndex({name: 1}, {unique: true});
      }
    }
    return _col;
  };
};

module.exports = {
  users: getCollectionFn("users"),
  comments: getCollectionFn("comments"),
  products: getCollectionFn("products")
};