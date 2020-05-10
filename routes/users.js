const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
	auth: {
	  user: 'shopsemall80@gmail.com',
	  pass: 'v8]QM{>]5Q`cWGMe'
	}
  });

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

		req.session.user.fullName = user.fullName;
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

router.get('/logout', async(req, res) => {
	req.session.destroy();
	res.render('', {
		'info': 'Logged out!'
	});
});

// router.get('/cart_number', async (req, res) => {
// 	res.json({ 'num': req.session.user.cart.length });
// });


router.get('/forgetpassword/:id', async (req, res) => {
	try {
		let data = await usersData.getUserById(req.params.id);
		res.render('forgetpassword', {
			'email_info': data.email
		}); 
	} catch (e) {
		res.json({ "err": 1, "msg": "Please enter valid ID." });
	}
});

router.post('/forgetpassword', async (req, res) => {
	try {
		console.log("inside")
		if (req.body.email) {
			let emailAddress = req.body.email.trim();
			let data = await usersData.checkEmail(emailAddress);
			console.log("inside")
			if (data.msg) {
				res.render('login', {
					'info': data.msg
				});
			} else {
				let mailOptions = {
					from: 'shopsemall80@gmail.com',
					to: emailAddress,
					subject: 'Reset Password Link',
					text: `Hello ${typeof data.fullName == 'undefined' ? "User" : data.fullName},\n\nHere is the link to reset your password: http://${req.get('host')}/users/forgetpassword/${data.data._id}.\n\nIf you have any troubles, email shopsemall80@gmail.com.`
				};
				transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						return console.log(error.message);
					}
					console.log('Email sent: ' + info.response);
				});				
				res.render('login', {
						'info': "Email Sent"
				});
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

			let email = req.body.email;
			let new_password = req.body.new_password;
			let updateData = await usersData.updateNewPassword(email, new_password);
			if (updateData.msg) {
				res.render('login', {
					'info': "Password has been changed successfully."
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