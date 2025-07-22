const { body, validationResult } = require("express-validator");
const query = require("../model/dbQuery");

exports.index = async (req, res) => {
  const categories = await query.getCategories();

  res.render("index", { title: "Home", categories: categories, errors: [] });
};
exports.categoriesGet = async (req, res) => {
  const categories = await query.getCategories();

  res.send(categories);
};
exports.categoryPost = [
  body("categoryName")
    .trim()
    .notEmpty()
    .withMessage("Category should not be empty.")
    .custom(async (value) => {
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
  res.render("items", {
    title: req.params.category,
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
  res.redirect(`/category/${req.params.categoryName}/${categoryId}`);
};

exports.itemsPost = [
  body("itemName")
    .trim()
    .notEmpty()
    .withMessage("Item name should not be empty.")
    .isLength({ min: 2, max: 255 })
    .withMessage("Item name should be between 5-255 characters.")
    .custom(async (value) => {
      const item = await query.checkItem(value);

      if (item.length > 0) {
        throw new Error("Item already exists.");
      }
    }),
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
    .isInt()
    .withMessage("Price should be numbers only."),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send({ errors: errors.array() });
      return;
    }
    const { categoryId, itemName, quantity, price } = req.body;
    await query.addItem(categoryId, itemName, quantity, price);
    res.send({ errors: [] });
  },
];
