const slotService = require("../services/slot.service");

function listSlots(req, res) {
  return res.json(slotService.listSlots(req.query.serviceId));
}

function createSlot(req, res) {
  const { serviceId, label, capacity, startsAt } = req.body;
  if (!serviceId || !label || !capacity || !startsAt) {
    return res.status(400).json({ message: "serviceId, label, capacity, startsAt are required" });
  }

  const result = slotService.createSlot({ serviceId, label, capacity, startsAt });
  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }
  return res.status(201).json(result.data);
}

function updateSlot(req, res) {
  const updated = slotService.updateSlot(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ message: "Slot not found" });
  }
  return res.json(updated);
}

function deleteSlot(req, res) {
  const removed = slotService.removeSlot(req.params.id);
  if (!removed) {
    return res.status(404).json({ message: "Slot not found" });
  }
  return res.status(204).send();
}

module.exports = {
  listSlots,
  createSlot,
  updateSlot,
  deleteSlot
};
