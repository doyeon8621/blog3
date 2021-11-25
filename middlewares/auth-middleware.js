const jwt = require("jsonwebtoken");
const User = require("../models/user");
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = authorization.split(" ");
  if (tokenType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 사용하세요",
    });
    return;
  }
  try {
    const { userId } = jwt.verify(tokenValue, "secret-secret-key");

    User.findById(userId)
      .exec()
      .then((user) => {
        res.locals.user = user; //유저 변수에 담아놓기, 이 미들웨를 사용하는 곳에서 공통적으로 사용할 수 있다
        next();
      });

    //유저가 없을지도 구현안 함//
  } catch (error) {
    res.status(401).send({
      errorMessage: "로그인 후 사용하세요",
    });
    return;
  }
};
