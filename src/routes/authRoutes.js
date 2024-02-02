const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", (req, res) => {
  console.log("Received POST request on /register");
  authController.register(req, res);
});
router.post("/login", authController.login);

module.exports = router;
