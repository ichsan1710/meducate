const express = require("express")
const courseController = require("../controllers/courseController")
const isAuthenticated = require("../middleware/authenticate")
const isAdmin = require("../middleware/isAdmin")

const router = express.Router()

router.get("/", [isAuthenticated , isAdmin], courseController.findAll)
router.post("/", [isAuthenticated , isAdmin], courseController.post)
router.get("/:id" , [isAuthenticated , isAdmin] , courseController.findById)
router.post("/:id/update" , [isAuthenticated , isAdmin] , courseController.update)
router.get("/:id/delete" , [isAuthenticated , isAdmin] , courseController.remove)                  

module.exports = router