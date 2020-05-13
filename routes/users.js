const express = require('express');
const router = express.Router();
const data = require('../data');
var xss = require("xss");
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

		let email = xss(user.email);
		let password = xss(user.password);

		user.email = email.toLowerCase();

		// check form
		if (email.length === 0 || password.length === 0) {
			res.json({"info": "error"});
			return;
		}

    let mailOptions = {
      from: 'shopsemall80@gmail.com',
      to: email,
      subject: 'Thank you for registering with Emall!',
      text: `Hello,\n\nThis email serves as confirmation that you have registered with Emall!\n\nIf you have any questions, email shopsemall80@gmail.com.\n\nThank you!`
    };
    transporter.sendMail(mailOptions, (error, info) => {``
      if (error) {
        return console.log(error.message);
      }
      console.log('Email sent: ' + info.response);
    });

		user = await usersData.addUser(user);
		if (user == null) {
			res.json({"info": "error"});
		} else {
			res.json({"info": "success"});
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
	let user = req.body;
	// check form
	let password = user.password;
	let payment = user.paymentInfo;
	let address = user.address;

	if (password.length === 0 || payment.length === 0 || address.length === 0) {
		res.json({'info': 'error'});
		return;
	}

	req.session.user.password = xss(user.password);
	req.session.user.paymentInfo = xss(user.paymentInfo);
	req.session.user.address = xss(user.address);

	user = await usersData.updateUser(req.session.user);

	res.json({'info': 'success'});
});

// login
router.post('/login', async (req, res) => {
	try {
		let email = xss(req.body.email);
		let password = xss(req.body.password);

		email = email.toLowerCase();

		// check form
		if (email.length === 0 || password.length === 0) {
			res.json({"info": "error"});
			return;
		}

		let user = await usersData.userLogin(email, password);

		if (user.length === 1) {
			req.session.user = user[0];
			res.json({"info": "success"});
		} else {
			res.json({"info": "error"});
		}
	} catch (e) {
		res.status(400).json({ "err": 1, "msg": e.message });
	}
});

router.get('/logout', async (req, res) => {
	delete req.session.user;
	res.redirect('/');
});

router.get('/cart_number', async (req, res) => {
	res.json({ 'num': req.session.user.cart.length });
});

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
		if (req.body.email) {
			let emailAddress = req.body.email;
			let data = await usersData.checkEmail(emailAddress);
			console.log("inside");
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
				transporter.sendMail(mailOptions, (error, info) => {``
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
