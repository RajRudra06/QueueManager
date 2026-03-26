const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const serviceRoutes = require("./service.routes");
const slotRoutes = require("./slot.routes");
const appointmentRoutes = require("./appointment.routes");
const adminRoutes = require("./admin.routes");

const router = express.Router();

router.use(healthRoutes);
router.use("/auth", authRoutes);
router.use("/services", serviceRoutes);
router.use("/slots", slotRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
