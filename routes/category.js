const express = require("express");
const categoryController = require("../controllers/categoryController");
const isAuthenticated = require("../middleware/authenticate");
const isAdmin = require("../middleware/isAdmin");


const router = express.Router();

router.get("/", [isAuthenticated , isAdmin], categoryController.findAll)
router.post("/", [isAuthenticated , isAdmin], categoryController.post)
router.get("/:id", [isAuthenticated , isAdmin], categoryController.findById)
router.post("/:id/update", [isAuthenticated , isAdmin], categoryController.update)
router.get("/:id/delete", [isAuthenticated , isAdmin], categoryController.remove)

module.exports = router;