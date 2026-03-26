const store = require("../data/store");
const { emitQueueUpdate } = require("./queue.service");

function listMyAppointments(userId) {
  const appointments = store.appointments
    .filter((a) => a.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return appointments.map((a) => {
    if (a.status !== "WAITING") {
      return a;
    }

    const waitingForSlot = store.appointments
      .filter((other) => other.slotId === a.slotId && other.status === "WAITING")
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const position = waitingForSlot.findIndex((other) => other.id === a.id) + 1;
    return { ...a, position };
  });
}

function bookAppointment({ userId, serviceId, slotId }) {
  const service = store.services.find((s) => s.id === serviceId && s.active !== false);
  if (!service) {
    return { error: "Service not found", status: 404 };
  }

  const slot = store.slots.find((s) => s.id === slotId);
  if (!slot) {
    return { error: "Slot not found", status: 404 };
  }

  if (slot.serviceId !== serviceId) {
    return { error: "Slot does not belong to selected service", status: 400 };
  }

  const waitingForSlot = store.appointments.filter((a) => a.slotId === slotId && a.status === "WAITING");
  if (waitingForSlot.length >= slot.capacity) {
    return { error: "Slot capacity reached", status: 409 };
  }

  const duplicate = waitingForSlot.find((a) => a.userId === userId);
  if (duplicate) {
    return { error: "You already have a waiting appointment in this slot", status: 409 };
  }

  const appointment = {
    id: store.nextId(),
    userId,
    serviceId,
    slotId,
    status: "WAITING",
    createdAt: new Date().toISOString()
  };

  store.appointments.push(appointment);
  emitQueueUpdate(slotId);

  return { data: appointment, status: 201 };
}

function cancelAppointment({ userId, appointmentId }) {
  const appt = store.appointments.find((a) => a.id === appointmentId);
  if (!appt || appt.userId !== userId) {
    return { error: "Appointment not found", status: 404 };
  }

  if (appt.status !== "WAITING") {
    return { error: "Only waiting appointments can be cancelled", status: 400 };
  }

  appt.status = "CANCELLED";
  appt.updatedAt = new Date().toISOString();
  emitQueueUpdate(appt.slotId);
  return { data: appt };
}

function rescheduleAppointment({ userId, appointmentId, serviceId, slotId }) {
  const appt = store.appointments.find((a) => a.id === appointmentId);
  if (!appt || appt.userId !== userId) {
    return { error: "Appointment not found", status: 404 };
  }

  if (appt.status !== "WAITING") {
    return { error: "Only waiting appointments can be rescheduled", status: 400 };
  }

  const previousSlotId = appt.slotId;
  const booking = bookAppointment({ userId, serviceId, slotId });
  if (booking.error) {
    return booking;
  }

  appt.status = "RESCHEDULED";
  appt.updatedAt = new Date().toISOString();
  emitQueueUpdate(previousSlotId);

  return { data: booking.data };
}

module.exports = {
  listMyAppointments,
  bookAppointment,
  cancelAppointment,
  rescheduleAppointment
};
