const express = require('express');
const router = express.Router();
const commentData = require('../data').comments;

router.post('/add', async (req, res) => {
    let comment = req.body;
    comment.name = req.session.user.email;
    console.log(comment);
    await commentData.addComment(comment);
    res.redirect('/products/detail/' + comment.product);
});

module.exports = router;