const express = require("express");
const router = express.Router();
const entryController = require("../controllers/entryController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware.authenticate, authMiddleware.authorize(["admin","user"]), entryController.getAllEntries);
router.get("/:id", entryController.getEntryById);
router.post("/",  entryController.createEntry);
router.put("/:id", authMiddleware.authenticate, authMiddleware.authorize(["admin"]), entryController.updateEntry);
router.delete("/:id", authMiddleware.authenticate, authMiddleware.authorize(["admin"]), entryController.deleteEntry);

router.get(
  "/report/average",
  authMiddleware.authenticate,
  authMiddleware.authorize(["admin"]),
  entryController.getAverageReport
);

module.exports = router;
