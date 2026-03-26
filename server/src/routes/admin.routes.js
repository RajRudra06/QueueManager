const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const controller = require("../controllers/admin.controller");

const router = express.Router();

router.get("/queue/:slotId", requireAuth, requireRole("ADMIN"), controller.getQueue);
router.post("/queue/:slotId/advance", requireAuth, requireRole("ADMIN"), controller.advanceQueue);

module.exports = router;
