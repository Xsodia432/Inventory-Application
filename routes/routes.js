const { Router } = require("express");
const router = Router();
const inventoryController = require("../controller/inventoryController");

router.get("/", inventoryController.index);

module.exports = router;
