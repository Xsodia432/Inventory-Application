const { body, validationResult } = require("express-validator");
const query = require("../model/dbQuery");

exports.index = (req, res) => {
  res.render("index", { title: "Home" });
};
