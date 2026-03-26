const store = require("../data/store");
const { getIo } = require("../realtime/socketState");

function getWaitingInSlot(slotId) {
  return store.appointments
    .filter((a) => a.slotId === slotId && a.status === "WAITING")
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

function getQueueSnapshot(slotId) {
  const waiting = getWaitingInSlot(slotId);
  return {
    slotId,
    waitingCount: waiting.length,
    nextAppointmentId: waiting.length > 0 ? waiting[0].id : null,
    queue: waiting
  };
}

function emitQueueUpdate(slotId) {
  const io = getIo();
  if (!io) {
    return;
  }

  const payload = getQueueSnapshot(slotId);
  io.to(`queue:${slotId}`).emit("queue:update", payload);
}

module.exports = {
  getWaitingInSlot,
  getQueueSnapshot,
  emitQueueUpdate
};
