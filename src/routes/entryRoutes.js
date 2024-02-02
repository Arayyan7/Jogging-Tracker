const express = require("express");
const router = express.Router();
const entryController = require("../controllers/entryController");

router.get("/", entryController.getAllEntries);
router.get("/:id", entryController.getEntryById);
router.post("/", entryController.createEntry);
router.put("/:id", entryController.updateEntry);
router.delete("/:id", entryController.deleteEntry);

router.get("/report/average", entryController.getAverageReport);

module.exports = router;
