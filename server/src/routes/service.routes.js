const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const controller = require("../controllers/service.controller");

const router = express.Router();

router.get("/", controller.listServices);
router.post("/", requireAuth, requireRole("ADMIN"), controller.createService);
router.put("/:id", requireAuth, requireRole("ADMIN"), controller.updateService);
router.delete("/:id", requireAuth, requireRole("ADMIN"), controller.deleteService);

module.exports = router;
