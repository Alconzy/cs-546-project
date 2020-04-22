const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;

router.post("/register", async (req, res) => {
	try {

		let user = req.body;
		user = await usersData.addUser(user);
		if (user == null) {
			res.render('register', {
				'info': 'The mail has been registered'
			})
		} else {
			req.session.user = user;
			res.render('changeinfo', {
				'user': user,
				'info': 'Please improve your personal information'
			});
		}
	} catch (e) {
		res.status(400).json({ "err": 1, "msg": e.message });
	}

});

router.post("/add_cart", async (req, res) => {
	try {
		let productId = req.body.id;
		req.session.user.cart.push(productId);
		await usersData.updateUser(req.session.user);
		res.send('ok');
	} catch (e) {
		res.status(400).json({ "err": 1, "msg": e.message });
	}
});

router.get("/changeinfo", async (req, res) => {
	try {
		res.render('changeinfo', {
			'user': req.session.user
		})
	} catch (e) {
		res.status(400).json({ "err": 1, "msg": e.message });
	}
});

router.post("/change", async (req, res) => {
	try {
		let user = req.body;
		req.session.user.password = user.password;
		req.session.user.paymentInfo = user.paymentInfo;
		req.session.user.address = user.address;
		user = await usersData.updateUser(req.session.user);
		res.redirect('/changeinfo');
	} catch (e) {
		res.status(400).json({ "err": 1, "msg": e.message });
	}
});

// login
router.post('/login', async (req, res) => {
	try {
		let email = req.body.email;
		let password = req.body.password;
		let user = await usersData.userLogin(email, password);
		if (user.length === 1) {
			req.session.user = user[0];
			res.redirect('/');
		} else {
			res.render('login', {
				'info': 'Wrong username or password'
			});
		}
	} catch (e) {
		res.status(400).json({ "err": 1, "msg": e.message });
	}
});

router.get('/cart_number', async (req, res) => {
	res.json({ 'num': req.session.user.cart.length });
});

router.post('/forget_pasword', async (req, res) => {
	try {
		if (req.body.email) {
			let emailAddress = req.body.email;
			let data = await usersData.sendForgetPasswordMail(emailAddress);
			if (data.msg) {
				res.render('login', {
					'info': data.msg
				});
			} else {
				res.json({ "userData": data.data });
			}
		} else {
			res.json({ "err": 1, "msg": "please enter email address." });
		}
	} catch (e) {
		res.status(400).json({ "err": 1, "msg": e.message });
	}

});

router.post('/update_new_passoword', async (req, res) => {
	try {
		if (req.body.new_password) {
			let id = rew.body._id;
			let new_password = req.body.new_password;
			let updateData = await usersData.updateNewPassword(id, new_password);
			if (updateData.msg) {
				res.render('login', {
					'info': "Please Login."
				});
			} else {
				res.render('login', {
					'info': "Something went wrong!"
				});
			}
		} else {
			res.render('changePassword', {
				'info':"Please Provide any password"
			});
		}
	} catch (e) {
		res.status(400).json({ "err": 1, "msg": e.message });
	}
});

module.exports = router;