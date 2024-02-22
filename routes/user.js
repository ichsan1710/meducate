const express = require("express")
const userController = require("../controllers/userController")
const isAuthenticated = require("../middleware/authenticate")
const isAdmin = require("../middleware/isAdmin")
const isUser = require("../middleware/isUser")


const router = express.Router()

router.get("/", [isAuthenticated, isAdmin], userController.getAllUsers)
router.post("/", [isAuthenticated, isAdmin], userController.createUser)
router.get("/:id", [isAuthenticated, isAdmin], userController.getUserById)
router.get("/:id/enrollment", [isAuthenticated, isAdmin], userController.getEnrollmentByUserId)
router.post("/:id/update", [isAuthenticated, isAdmin], userController.updateUserById)
router.get("/:id/delete", [isAuthenticated, isAdmin], userController.remove)
router.get("/home/dashboard", [isAuthenticated, isAdmin], userController.dashboard)

// user
router.get("/role/home", [isAuthenticated, isUser], userController.userDashboard)
router.get("/role/courses", [isAuthenticated, isUser], userController.userAllCourse)

router.post("/role/courses", [isAuthenticated, isUser], userController.enroll)
router.get("/role/course/confirm/:id", userController.updateStatusCourse)
router.get("/role/course/learnmore/detail/:id", [isAuthenticated , isUser], userController.getUserCourseById)
router.get("/role/profile" , [isAuthenticated , isUser] , userController.getProfile)
router.post("/role/profile" , [isAuthenticated , isUser] , userController.updateProfile)



router.post("/login", userController.login)
router.post("/register", userController.register)

module.exports = router;
