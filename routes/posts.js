var express = require('express')
var router = express.Router()
// Posts model
const Posts = require('../models/postsModel');


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
            name: req.body.name,
            content: req.body.content,
            tags: req.body.tags,
            type: req.body.type
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

router.delete('/:id', async function (req, res, next) {
    try {
        const id = req.params.id
        const posts = await Posts.findByIdAndDelete(id)
        res.status(200).json({
            status: "success",
            post: posts
        })
    }
    catch (err) {
        res.status(400).json({
            status: "err",
            message: "無此id可刪除"
        })
    }
});

router.delete('/', async function (req, res, next) {
    try {
        const posts = await Posts.deleteMany({})
        res.status(200).json({
            status: "success",
            post: posts
        })
    }
    catch (err) {
        res.status(400).json({
            status: "err",
            message: "刪除失敗"
        })
    }
});

router.patch('/:id', async function (req, res, next) {
    try {
        const id = req.params.id
        const posts = await Posts.findByIdAndUpdate(id, {
            name: req.body.name,
            content: req.body.content,
            tags: req.body.tags,
            type: req.body.type
        })
        res.status(200).json({
            status: "success",
            post: posts
        })
    }
    catch (err) {
        res.status(400).json({
            status: "err",
            message: "修改失敗 OR 欄位未填寫正確"
        })
    }
});

module.exports = router;