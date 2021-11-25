const express = require("express");
const Post = require("../models/post");
//const jwt = require("jsonwebtoken");
const router = express.Router();

//글 전체 목록보기
router.get("/list", async (req, res, next) => {
  try {
    const posts = await Post.find({}).sort("-date");
    res.json({ post: posts });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
