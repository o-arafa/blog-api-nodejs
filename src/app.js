// src/app.js
const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Blog API is working!" });
});

module.exports = app;
