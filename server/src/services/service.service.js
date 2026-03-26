const store = require("../data/store");

function listServices() {
  return store.services;
}

function createService({ name, description, active }) {
  const item = {
    id: store.nextId(),
    name,
    description: description || "",
    active: active !== false,
    createdAt: new Date().toISOString()
  };
  store.services.push(item);
  return item;
}

function updateService(id, payload) {
  const service = store.services.find((s) => s.id === id);
  if (!service) {
    return null;
  }

  if (payload.name !== undefined) service.name = payload.name;
  if (payload.description !== undefined) service.description = payload.description;
  if (payload.active !== undefined) service.active = payload.active;
  return service;
}

function removeService(id) {
  const idx = store.services.findIndex((s) => s.id === id);
  if (idx === -1) {
    return false;
  }
  store.services.splice(idx, 1);
  return true;
}

module.exports = {
  listServices,
  createService,
  updateService,
  removeService
};
