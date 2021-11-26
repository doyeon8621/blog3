//페이지 셋 전체 리스트, 상세보기, 쓰기(수정)
const express = require("express");
const mongoose = require("mongoose");
//mongodb연결
mongoose.connect("mongodb://localhost/blog_demo2", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();
//유저 api용 router객체 설정
const UserRouter = require("./routers/user");
const PostRouter = require("./routers/post");
const CommentRouter = require("./routers/comment");

//json으로 데이터를 가공해 주는 미들웨어
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//기본제공 미들웨어 static (정적자산)
app.use(express.static("public"));
//ejs템플릿 엔진 사용
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
//router 객체 사용
app.use("/api", [UserRouter]);
app.use("/api", [PostRouter]);
app.use("/comment", [CommentRouter]);
//로그인
app.get("/logins", (req, res) => {
  res.render("login");
});
//회원가입하기
app.get("/registers", (req, res) => {
  res.render("register");
});

//메인 페이지 글 목록 전체
app.get("/", (req, res) => {
  res.render("index");
});

//글상세
app.get("/details", (req, res) => {
  res.render("detail");
});

//글 수정하기
app.get("/update", (req, res) => {
  res.render("update");
});
//글 쓰기
app.get("/write", (req, res) => {
  res.render("write");
});

app.listen(3000, () => {
  console.log(`listening at http://localhost:3000`);
});
