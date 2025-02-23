const express = require("express");

const app = express();
app.use(express.json());

const appError = require("./middleware/appError");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    if (!data.content) {
      // appError 自訂錯誤回饋
      console.log("appError");
      next(appError(400, "content is required"));
    }
    const newPost = await Post.create({
      user: data.user,
      content: data.content,
      tags: data.tags,
      type: data.type,
    });
    res.status(200).json({
      status: "success",
      data: newPost,
    });
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  return res.status(404).json({ status: "error", message: "Not Found" });
});

// app.use((err, req, res, next) => {
//   return err;
//   // .status(500)
//   // .json({ status: "error", message: "系統錯誤，請恰系統管理員" });
// });

app.listen(3000);
