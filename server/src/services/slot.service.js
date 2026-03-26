const store = require("../data/store");

function listSlots(serviceId) {
  if (!serviceId) {
    return store.slots;
  }
  return store.slots.filter((slot) => slot.serviceId === serviceId);
}

function createSlot({ serviceId, label, capacity, startsAt }) {
  const service = store.services.find((s) => s.id === serviceId);
  if (!service) {
    return { error: "Service not found", status: 404 };
  }

  const slot = {
    id: store.nextId(),
    serviceId,
    label,
    capacity,
    startsAt,
    createdAt: new Date().toISOString()
  };

  store.slots.push(slot);
  return { data: slot };
}

function updateSlot(id, payload) {
  const slot = store.slots.find((s) => s.id === id);
  if (!slot) {
    return null;
  }

  if (payload.label !== undefined) slot.label = payload.label;
  if (payload.capacity !== undefined) slot.capacity = payload.capacity;
  if (payload.startsAt !== undefined) slot.startsAt = payload.startsAt;
  return slot;
}

function removeSlot(id) {
  const idx = store.slots.findIndex((s) => s.id === id);
  if (idx === -1) {
    return false;
  }
  store.slots.splice(idx, 1);
  return true;
}

module.exports = {
  listSlots,
  createSlot,
  updateSlot,
  removeSlot
};
