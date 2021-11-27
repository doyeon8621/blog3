const express = require("express");
const Post = require("../models/post");
//const jwt = require("jsonwebtoken");
const Joi = require("joi");
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
/*
글쓰기 유효성검사
*/
const postPostsSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  date: Joi.string().required(),
});

//글쓰기
router.post("/write", authMiddleware, async (req, res) => {
  try {
    const { title, date, content } = await postPostsSchema.validateAsync(
      req.body
    );
    const writer = res.locals.user.nickname;
    await Post.create({
      title,
      writer,
      date,
      content,
    });

    res.send({ result: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});

//글수정
router.patch("/update/:postId/set", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, date } = await postPostsSchema.validateAsync(
      req.body
    );
    const nickname = res.locals.user.nickname;
    let post = await Post.findOne({ _id: postId });
    if (post) {
      post.title = title;
      post.content = content;
      post.date = date;
      await post.save();
    }
    res.send({ result: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
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
