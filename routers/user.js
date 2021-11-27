const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
/*
유효성검사
*/
const postUsersSchema = Joi.object({
  nickname: Joi.string().alphanum().min(3).required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().min(4).required(),
});

/*
회원가입
*/
router.post("/users", async (req, res) => {
  try {
    const { nickname, password, confirmPassword } =
      await postUsersSchema.validateAsync(req.body);
    if (password !== confirmPassword) {
      res.status(400).send({
        errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
      });
      return;
    }
    //동일 닉네임이 있는지
    const existsUser = await User.findOne({ nickname });
    if (existsUser) {
      res.status(400).send({
        errorMessage: "중복된 닉네임입니다.",
      });
      return;
    }
    if (password.includes(nickname)) {
      res.status(400).send({
        errorMessage: "닉네임이 비밀번호에 포함돼 있습니다.",
      });
      return;
    }
    const user = new User({ nickname, password });
    await user.save();
    //201은 created를 뜻한다.
    res.status(201).send({ result: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});

/*
로그인
*/
//Authenticate를 줄인 단어인데, 로그인 한다는 행위 자체를 "사용자가 자신의 정보를 인증한다" 라고 보기 때문에
// 일반적으로 로그인에 자주 사용되는 경로!
router.post("/auth", async (req, res) => {
  try {
    const { nickname, password } = await postUsersSchema.validateAsync(
      req.body
    );

    const user = await User.findOne({ nickname }).exec();

    if (!user || password !== user.password) {
      res.status(400).send({
        errorMessage: "닉네임 또는 패스워드를 확인해주세요",
      });
      return;
    }
    res.send({
      token: jwt.sign({ userId: user.userId }, "secret-secret-key"),
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});
//로그인 중인지 확인
router.get("/users/me", authMiddleware, async (req, res) => {
  const { user } = res.locals;
  if (!user) {
    res.status(401).send({
      errorMessage: "로그인이 필요합니다.",
    });
    return;
  }

  res.send({
    user,
  });
});

module.exports = router;
