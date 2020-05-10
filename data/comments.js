const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const uuid = require('uuid');

let exportedMethods = {
    async getAllComment() {
        const commentCollection = await comments();
		const commentList = await commentCollection.find({}).toArray();
		return commentList;
    },
	async getCommentById(id) {
		const commentCollection = await comments();
		const comment = await commentCollection.findOne({ _id: id });
		return comment;
	},
	async updateComment(id, quantity) {
		const commentCollection = await comments();

		let updatedComment = {
			stockRemaining: quantity
		};
		const updateInfo = await commentCollection.updateOne({ _id: id }, { $set: updatedComment });
		if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
		return this.getProductById(id);
	},
	async addComment(comment) {
		const commentCollection = await comments();

		let newComment = {
			'name': comment.name,
			'product': comment.product,
			'comment': comment.comment,
			'rating': comment.rating,
			_id: uuid.v4()
		};

		const newInsertInformation = await commentCollection.insertOne(newComment);
		if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
		return this.getCommentById(newInsertInformation.insertedId);
	},
	async getCommentByProduct(productId) {
		const commentCollection = await comments();
		const commentsList = await commentCollection.find({'product': productId}).toArray();
		return commentsList;
	}
};

module.exports = exportedMethods;