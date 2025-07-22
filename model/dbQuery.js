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
  return rows;
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
exports.deleteCategory = async (categoryId) => {
  await pool.query("DELETE FROM categories WHERE id=$1", [categoryId]);
};
exports.deleteItem = async (itemId) => {
  await pool.query("DELETE FROM items WHERE id=$1", [itemId]);
};
