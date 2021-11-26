const express = require("express");
const Post = require("../models/post");
//const jwt = require("jsonwebtoken");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

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

//글 상세보기
router.get("/list/:postId", async (req, res) => {
  const { postId } = req.params;
  const posts = await Post.findOne({ _id: postId });
  res.json({ detail: posts });
});

//글쓰기
router.post("/write", authMiddleware, async (req, res) => {
  const { title, date, content } = req.body;
  const writer = res.locals.user.nickname;
  await Post.create({
    title,
    writer,
    date,
    content,
  });

  res.send({ result: "success" });
});

//글수정
router.patch("/update/:postId/set", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { title, content, date } = req.body;

  let post = await Post.findOne({ postId });
  if (post) {
    post.title = title;
    post.content = content;
    post.date = date;
    await post.save();
  }
  res.send({ result: "success" });
});
//글삭제
router.delete("/update/:postId/delete", authMiddleware, async (req, res) => {
  const { postId } = req.params;

  const post = await Post.find({ postId });
  if (post.length > 0) {
    await Post.deleteOne({ _id: postId });
  }

  res.send({ result: "success" });
});

module.exports = router;
