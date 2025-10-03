const express = require("express");
const postRouter = require("./routes/postRoutes");
const errorHandler = require("./middleware/errorHandler");
const AppError = require("./utils/AppError");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Blog API is working!" });
});

app.use((req, res, next) => {
  console.log("req.body:", req.body);
  console.log("Content-Type:", req.headers["content-type"]);
  next();
});
app.use("/api/posts", postRouter);

app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

module.exports = app;
