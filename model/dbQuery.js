const pool = require("./dbCon");

exports.getCategories = async () => {
  const categories = await pool.query("SELECT * from categories");
  const items = await pool.query(
    "SELECT CASE WHEN category_id IS NULL THEN 'null' ELSE CAST(category_id AS TEXT) END AS id, CASE WHEN category_id IS NULL THEN 'Uncategorized' ELSE 'Nothing' END AS categoryname from items WHERE category_id IS NULL GROUP BY category_id"
  );
  if (items.rows.length !== 0) categories.rows.push(items.rows[0]);

  return categories.rows;
};
exports.addCategory = async (categoryName) => {
  await pool.query("INSERT INTO categories(categoryname) VALUES($1)", [
    categoryName,
  ]);
};
exports.getItems = async (id) => {
  const checkId = id === "null" ? null : id;

  const { rows } = await pool.query(
    "SELECT * from items WHERE ((CAST($1 AS INT) IS NULL AND category_id IS NULL) OR ($1 IS NOT NULL AND category_id=$1))",
    [checkId]
  );
  return rows;
};
exports.addItem = async (categoryId, itemName, quantity, price) => {
  await pool.query(
    "INSERT INTO items(itemname,quantity,price,category_id) VALUES($1,$2,$3,$4)",
    [itemName, quantity, price, categoryId]
  );
};

exports.checkItem = async (itemName) => {
  const { rows } = await pool.query("SELECT * FROM items WHERE itemname=$1", [
    itemName,
  ]);
  return rows.length;
};
exports.checkItemUpdate = async (itemName, itemNameCopy) => {
  if (itemName === itemNameCopy) return 0;
  else {
    const { rows } = await pool.query("SELECT * FROM items WHERE itemname=$1", [
      itemName,
    ]);
    return rows.length;
  }
};
exports.checkCategory = async (categoryName) => {
  const { rows } = await pool.query(
    "SELECT * FROM categories WHERE categoryname=$1",
    [categoryName]
  );
  if (rows.length > 0) {
    return true;
  }
};
exports.checkCategoryUpdate = async (categoryName, categoryNameCopy) => {
  if (categoryName === categoryNameCopy) return 0;
  else {
    const { rows } = await pool.query(
      "SELECT * FROM categories WHERE categoryname=$1",
      [categoryName]
    );
    return rows.length;
  }
};
exports.deleteCategory = async (categoryId) => {
  await pool.query("DELETE FROM categories WHERE id=$1", [categoryId]);
};
exports.deleteItem = async (itemId) => {
  await pool.query("DELETE FROM items WHERE id=$1", [itemId]);
};
exports.itemCount = async () => {
  const { rows } = await pool.query(
    "SELECT CAST(count(*) as INT) as count FROM items WHERE category_id IS NULL"
  );
  return rows;
};
exports.categoryUpdate = async (categoryName, categoryId) => {
  await pool.query("UPDATE categories SET categoryname=$1 WHERE id=$2", [
    categoryName,
    categoryId,
  ]);
};
exports.categoryGet = async (categoryId) => {
  let rows = {};
  if (categoryId === "null")
    rows = await pool.query("SELECT * from items WHERE category_id IS NULL");
  else
    rows = await pool.query("SELECT * from categories WHERE id=$1", [
      categoryId,
    ]);

  return rows.rows;
};
exports.itemUpdate = async (itemName, quantity, price, itemId) => {
  await pool.query(
    "UPDATE items SET itemname=$1, quantity=$2, price=$3 WHERE id=$4",
    [itemName, parseInt(quantity), parseFloat(price), itemId]
  );
};
