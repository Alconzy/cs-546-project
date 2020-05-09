const express = require('express');
const router = express.Router();
const commentData = require('../data').comments;

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
    res.render('admin', {});
});
module.exports = router;