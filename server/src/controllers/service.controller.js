const serviceService = require("../services/service.service");

function listServices(_req, res) {
  return res.json(serviceService.listServices());
}

function createService(req, res) {
  const { name, description, active } = req.body;
  if (!name) {
    return res.status(400).json({ message: "name is required" });
  }
  const created = serviceService.createService({ name, description, active });
  return res.status(201).json(created);
}

function updateService(req, res) {
  const updated = serviceService.updateService(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ message: "Service not found" });
  }
  return res.json(updated);
}

function deleteService(req, res) {
  const removed = serviceService.removeService(req.params.id);
  if (!removed) {
    return res.status(404).json({ message: "Service not found" });
  }
  return res.status(204).send();
}

module.exports = {
  listServices,
  createService,
  updateService,
  deleteService
};
