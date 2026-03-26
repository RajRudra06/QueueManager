const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const controller = require("../controllers/slot.controller");

const router = express.Router();

router.get("/", controller.listSlots);
router.post("/", requireAuth, requireRole("ADMIN"), controller.createSlot);
router.put("/:id", requireAuth, requireRole("ADMIN"), controller.updateSlot);
router.delete("/:id", requireAuth, requireRole("ADMIN"), controller.deleteSlot);

module.exports = router;
