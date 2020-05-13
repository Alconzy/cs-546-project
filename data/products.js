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
	},

	async productFilter(tag, filterData, color){
		const productCollection = await products();
		let where_Condition = {};
		let sort = {}
		if(tag ){
			where_Condition = {tags : tag } 
		}
		if(color ){
			where_Condition["color"] = {$in : color}
		}
		if(filterData == "HL") // High to Low
		{
			sort = { price : -1}
		}else if(filterData == "LH"){ // Low to High Price
			sort = { price : 1}
		}
		
		let list = await productCollection.find( { $query: where_Condition, $orderby: sort } )
		return list.toArray(); 
	},
	async productSellCount(id, count){
		const productCollection = await products();

		let updatedProduct = {
			sellCount: count
		};
		const updateInfo = await productCollection.updateOne({ _id: id }, { $set: updatedProduct });
		if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
		return this.getProductById(id);
	}, 
	async productGraph(){
		const productCollection = await products();
		const productList = await productCollection.find({}).project({_id : 0, sellCount : 1, name : 1}).toArray();
		return productList
	}
};

module.exports = exportedMethods;