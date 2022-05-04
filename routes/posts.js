var express = require('express')
var router = express.Router()
// Posts model
const Posts = require('../models/postsModel');

const User = require('../models/usersModel');


router.get('/', async function (req, res, next) {
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt"
    const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};
    const allPosts = await Posts.find(q).populate({
        path: 'user',
        select: 'name photo '
    }).sort(timeSort);

    res.status(200).json({ allPosts })
});

router.post('/', async function (req, res, next) {
    try {
        const newPost = await Posts.create({
            user: req.body.user,
            content: req.body.content,
            image: req.body.image
        })
        res.status(200).json({
            status: "success",
            post: newPost
        })
    }
    catch (err) {
        res.status(400).json({
            status: "err",
            message: "欄位未填寫正確"
        })
    }
});

module.exports = router;