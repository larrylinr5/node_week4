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

router.post('/', handleErrorAsync(async function (req, res, next) {
  if (req.body.content == undefined) {
    return next(appError(400, "欄位未填寫正確", next))
  }
  const newPost = await Posts.create({
    user: req.body.user,
    content: req.body.content,
    image: req.body.image
  })
  res.status(200).json({
    status: "success",
    post: newPost
  })
}));

router.delete('/', handleErrorAsync(async function (req, res, next) {
  const result = await Posts.deleteMany({});
  res.status(200).json({
    status: "success",
    post: result
  })
}));

router.delete('/:id', handleErrorAsync(async function (req, res, next) {
  const id = req.url.split('/').pop();
  const result = await Posts.findByIdAndDelete(id);

  if (result) {
    res.status(200).json({
      status: "success",
      post: result
    })
  } else {
    appError(400, "單筆資料刪除失敗", next);
  }
}));

router.patch('/:id', handleErrorAsync(async function (req, res, next) {
  const { body } = req;

  const id = req.url.split('/').pop();

  const result = await Posts.findByIdAndUpdate(id, body, { runValidators: true });

  if (result) {
    res.status(200).json({
      status: "success",
      post: result
    })
  } else {
    appError(400, "資料更新失敗", next);
  }
}));

module.exports = router;