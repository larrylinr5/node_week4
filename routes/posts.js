var express = require('express')
var router = express.Router()
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");
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

router.post('/', handleErrorAsync(async function(req, res, next) {
    if(req.body.content == undefined){
      return next(appError(400,"欄位未填寫正確",next))
    }
    const newPost = await Posts.create({
        user: req.body.user,
        content: req.body.content,
        image: req.body.image
    })
      res.status(200).json({
        status:"success",
        post: newPost
      })
  }));

module.exports = router;