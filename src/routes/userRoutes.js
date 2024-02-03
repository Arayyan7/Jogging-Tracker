const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Apply authentication middleware to specific routes
router.get(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize(["admin", "user_manager"]),
  userController.getAllUsers
);
router.post(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize(["admin", "user_manager"]),
  userController.createUser
);
router.put(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize(["admin", "user_manager"]),
  userController.updateUser
);
router.delete(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize(["admin", "user_manager"]),
  userController.deleteUser
);

module.exports = router;
