const { Router } = require("express");
const router = Router();
const inventoryController = require("../controller/inventoryController");

router.get("/", inventoryController.index);

router.post("/", inventoryController.categoryPost);
router.get("/category/:category/:id", inventoryController.itemsView);
router.post("/category/:id", inventoryController.categoryDelete);
router.post("/items/:category/:categoryId", inventoryController.itemsPost);
router.post(
  "/item/:itemId/:categoryName/:categoryId",
  inventoryController.itemDelete
);
router.post("/categoryUpdate", inventoryController.categoryUpdate);
module.exports = router;
