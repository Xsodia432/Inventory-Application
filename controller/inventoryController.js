const { body, validationResult } = require("express-validator");
const query = require("../model/dbQuery");

const errorsItem = [
  body("itemName")
    .trim()
    .notEmpty()
    .withMessage("Item name should not be empty.")
    .isLength({ min: 2, max: 255 })
    .withMessage("Item name should be between 5-255 characters."),
  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Quantity should not be empty.")
    .isInt()
    .withMessage("Quantity should be numbers only."),
  body("price")
    .trim()
    .notEmpty()
    .withMessage("Price should not be empty.")
    .isDecimal()
    .withMessage("Price should be numbers only."),
];
const errorsCategory = [
  body("categoryName")
    .trim()
    .notEmpty()
    .withMessage("Category should not be empty."),
];
exports.index = async (req, res) => {
  const categories = await query.getCategories();

  res.render("index", { title: "Home", categories: categories, errors: [] });
};
exports.categoriesGet = async (req, res) => {
  const categories = await query.getCategories();

  res.send(categories);
};
exports.categoryPost = [
  errorsCategory,
  body("categoryName").custom(async (value) => {
    if (await query.checkCategory(value)) {
      throw new Error("Category already exists.");
    }
  }),
  async (req, res, next) => {
    const errors = validationResult(req);
    const categories = await query.getCategories();
    if (!errors.isEmpty()) {
      res.render("index", {
        title: "Home",
        categories: categories,
        errors: errors.array(),
      });
      return;
    }
    const categoryName = req.body.categoryName
      .split("")
      .map((val, index) =>
        index === 0 ? val.toUpperCase() : val.toLowerCase()
      )
      .join("");

    await query.addCategory(categoryName);
    res.redirect("/");
  },
];
exports.itemsView = async (req, res) => {
  const categoryId = req.params.id === "none" ? "null" : req.params.id;

  const result = await query.getItems(categoryId);

  const title = await query.categoryGet(categoryId);

  res.render("items", {
    title: req.params.id === "none" ? "Uncategorized" : title[0].categoryname,
    result: result,
    categoryId: categoryId,
  });
};

exports.categoryDelete = async (req, res) => {
  await query.deleteCategory(req.params.id);
  res.redirect("/");
};
exports.itemDelete = async (req, res) => {
  const categoryId =
    req.params.categoryId === "null" ? "none" : req.params.categoryId;
  await query.deleteItem(req.params.itemId);
  if (categoryId === "none") {
    const itemCount = await query.itemCount();
    if (itemCount[0].count === 0) {
      res.redirect("/");
      return;
    }
  }
  res.redirect(`/category/${categoryId}`);
};

exports.categoryUpdate = [
  errorsCategory,
  body().custom(async (value) => {
    const length = await query.checkCategoryUpdate(
      value.categoryName,
      value.categoryNameCopy
    );
    if (length > 0) {
      throw new Error("Category already exists.");
    }
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send({ errors: errors.array() });
      return;
    }
    await query.categoryUpdate(
      req.body.categoryName,
      parseInt(req.body.categoryId)
    );
    res.send({
      msg: "Sent",

      categoryId: req.body.categoryId,
    });
  },
];
exports.itemsPost = [
  errorsItem,
  body().custom(async (value) => {
    const item = await query.checkItem(value.itemName);
    if (item > 0) {
      throw new Error("Item already exists.");
    }
  }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send({ errors: errors.array() });
      return;
    }
    const { itemName, quantity, price, categoryId } = req.body;

    await query.addItem(categoryId, itemName, quantity, price);
    res.send({ msg: "Sent", categoryId: req.body.categoryId });
  },
];
exports.itemUpdate = [
  errorsItem,
  body().custom(async (value) => {
    const item = await query.checkItemUpdate(
      value.itemName,
      value.itemNameCopy
    );

    if (item > 0) {
      throw new Error("Item already exists.");
    }
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send({ errors: errors.array() });
      return;
    }
    const { itemName, quantity, price, itemId, categoryId } = req.body;
    await query.itemUpdate(itemName, quantity, price, itemId);
    res.send({ msg: "Sent", categoryId });
  },
];
