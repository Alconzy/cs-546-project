const express = require('express');
const router = express.Router();
const userData = require('../data').users;

router.use('/*', async (req, res, next) => {
    console.log(req.session.user.email + req.session.user.adminLevel);
    try {
        if(req.session.user.adminLevel > 0) {
            next();
        } else {
            res.status(403).json({ "err": 1, "msg": "Invalid Permissions"});
        }
    } catch (e) {
        res.status(403).json({ "err": 1, "msg": "Invalid Permissions"});
    }
});

router.get('/', async (req, res) => {
    res.render('admin',  
    {layout: false});
});

router.get('/users', async (req, res) => {  
    let current = await userData.getAllUsers();
    for(let i = 0; i < current.length; i++) {
        if(current[i].adminLevel == 1) {
            current[i].admin = true;
        }
        console.log(current[i]);
    }
    res.render('OtherUsers', 
    {users: current.filter(curUser => curUser._id != req.session.user._id),
        layout: 'admin'});
});

router.post('/users', async (req, res) => {  
    let current = await userData.getAllUsers();
    res.render('OtherUsers', 
    {users: current.filter(curUser => curUser._id != req.session.user._id),
        layout: 'admin'});
});
module.exports = router;