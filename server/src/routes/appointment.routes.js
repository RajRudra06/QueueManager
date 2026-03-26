const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const controller = require("../controllers/appointment.controller");

const router = express.Router();

router.post("/", requireAuth, requireRole("STUDENT"), controller.bookAppointment);
router.get("/mine", requireAuth, requireRole("STUDENT"), controller.listMine);
router.patch("/:id/cancel", requireAuth, requireRole("STUDENT"), controller.cancel);
router.patch("/:id/reschedule", requireAuth, requireRole("STUDENT"), controller.reschedule);

module.exports = router;
