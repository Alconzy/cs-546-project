const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const uuid = require('uuid');
//
let exportedMethods = {
	async getUserById(id) {
		const userCollection = await users();
		const user = await userCollection.findOne({ _id: id });
		return user;
	},
	async userLogin(email, password) {
		const userCollection = await users();
		const user = await userCollection.find({ 'email': email, 'password': password }).toArray();
		return user;
	},
	async addUser(user) {
		const userCollection = await users();

		let newUser = {
			email: user.email,
			password: user.password,
			fullName : '',
			orderHistory: [],
			paymentInfo: '',
			address: '',
			cart: [],
			adminLevel: 0,
			_id: uuid.v4()
		};

		try {
			const newInsertInformation = await userCollection.insertOne(newUser);
			if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
			return this.getUserById(newInsertInformation.insertedId);
		} catch (e) {
			return null;
		}
	},
	async updateUser(user) {
		const userCollection = await users();

		let updatedUser = {
			email: user.email,
			password: user.password,
			fullName: user.fullName,
			orderHistory: user.orderHistory,
			paymentInfo: user.paymentInfo,
			address: user.address,
			cart: user.cart,
			adminLevel: user.adminLevel,
		};
		const updateInfo = await userCollection.updateOne({ _id: user._id }, { $set: updatedUser });
		if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
		return this.getUserById(user._id);
	},
//above contributed by Hongfeng Ou except for adding adminlevel and full name (for 'retrieve password' functionality)
	async checkEmail(emailAddress) {
		const userCollection = await users();
		let userEmail = await userCollection.findOne({ email: emailAddress })
		if (userEmail == null) {
			return ({ "msg": "Please enter valid email address." });
		} else {
			return ({ "data": userEmail });
		}
	},

	async updateNewPassword(email, pass) {
		const userCollection = await users();
		let updatePassword = await userCollection.updateOne({ email: email }, { $set: { password: pass } });
		if (!updatePassword.matchedCount && !updatePassword.modifiedCount) throw 'Update Password Failed';
		return ({ "msg": "success" });
	}
};

module.exports = exportedMethods;