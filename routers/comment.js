const express = require("express");
const Comment = require("../models/comment");
//const jwt = require("jsonwebtoken");
const Joi = require("joi");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

//댓 전체 목록보기
router.get("/list", async (req, res, next) => {
  const { postId } = req.query;
  try {
    const comments = await Comment.find({ postId: postId }).sort("-date");
    res.json({ commentlist: comments });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
/*
유효성검사
*/
const postCommentsSchema = Joi.object({
  content: Joi.string().required(),
  date: Joi.string(),
  postId: Joi.string(),
});

//댓쓰기
router.post("/write/:postId", authMiddleware, async (req, res) => {
  const writer = res.locals.user.nickname;
  if (!writer) {
    res.status(401).send({
      errorMessage: "로그인이 필요합니다.",
    });
    return;
  }
  try {
    const { date, content, postId } = await postCommentsSchema.validateAsync(
      req.body
    );

    await Comment.create({
      postId,
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

//댓수정
router.patch("/update/:commentId/set", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = await postCommentsSchema.validateAsync(req.body);

    let comment = await Comment.findOne({ _id: commentId });
    if (comment) {
      comment.content = content;
      await comment.save();
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
router.delete("/update/:commentId/delete", authMiddleware, async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.find({ commentId });
  if (comment.length > 0) {
    await Comment.deleteOne({ _id: commentId });
    res.send({ result: "success" });
  }
});

module.exports = router;
