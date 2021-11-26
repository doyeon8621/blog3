const express = require("express");
const Comment = require("../models/comment");
//const jwt = require("jsonwebtoken");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

//글 전체 목록보기
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

//글쓰기
router.post("/write/:postId", authMiddleware, async (req, res) => {
  const { date, content, postId } = req.body;
  const writer = res.locals.user.nickname;
  await Comment.create({
    postId,
    writer,
    date,
    content,
  });

  res.send({ result: "success" });
});

//글수정
router.patch("/update/:commentId/set", authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const { content, date } = req.body;

  let comment = await Comment.findOne({ commentId });
  if (comment) {
    comment.content = content;
    comment.date = date;
    await comment.save();
  }
  res.send({ result: "success" });
});
//글삭제
router.delete("/update/:commentId/delete", authMiddleware, async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.find({ commentId });
  if (comment.length > 0) {
    await Comment.deleteOne({ _id: commentId });
  }

  res.send({ result: "success" });
});

module.exports = router;
