const store = require("../data/store");
const { getQueueSnapshot, getWaitingInSlot, emitQueueUpdate } = require("./queue.service");

function getQueue(slotId) {
  const slot = store.slots.find((s) => s.id === slotId);
  if (!slot) {
    return { error: "Slot not found", status: 404 };
  }

  return { data: getQueueSnapshot(slotId) };
}

function advanceQueue(slotId) {
  const slot = store.slots.find((s) => s.id === slotId);
  if (!slot) {
    return { error: "Slot not found", status: 404 };
  }

  const waiting = getWaitingInSlot(slotId);
  if (waiting.length === 0) {
    return { error: "No waiting appointments", status: 400 };
  }

  const next = waiting[0];
  next.status = "COMPLETED";
  next.updatedAt = new Date().toISOString();

  emitQueueUpdate(slotId);
  return { data: next };
}

module.exports = {
  getQueue,
  advanceQueue
};
