const mongoCollections = require('../config/mongoCollections');
const products = mongoCollections.products;
const uuid = require('uuid');

let exportedMethods = {
    async getAllProduct() {
        const productCollection = await products();
		const productList = await productCollection.find({}).toArray();
		return productList;
    },
	async addProduct(product) {
		const productCollection = await products();

		let newProduct = {
			name: product.name,
			description: product.description,
			image: product.image,
			tags: product.tags,
			stocks: product.stocks,
			price: product.price,
			rating: product.rating,
			_id: uuid.v4()
		};

		const newInsertInformation = await productCollection.insertOne(newProduct);
		if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
		return this.getProductById(newInsertInformation.insertedId);
	},
	async getProductById(id) {
		const productCollection = await products();
		const product = await productCollection.findOne({ _id: id });
		return product;
	},
	async updateProductStockRemaining(id, quantity) {
		const productCollection = await products();

		let updatedProduct = {
			stocks: quantity
		};
		const updateInfo = await productCollection.updateOne({ _id: id }, { $set: updatedProduct });
		if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
		return this.getProductById(id);
	},
	async searchProducts(keyword) {
		const productCollection = await products();
		let list = await productCollection.find({name: eval("/" + keyword + "/i")});
		return list.toArray();
	}
};

module.exports = exportedMethods;