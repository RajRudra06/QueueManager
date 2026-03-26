const appointmentService = require("../services/appointment.service");

function bookAppointment(req, res) {
  const { serviceId, slotId } = req.body;
  if (!serviceId || !slotId) {
    return res.status(400).json({ message: "serviceId and slotId are required" });
  }

  const result = appointmentService.bookAppointment({
    userId: req.user.id,
    serviceId,
    slotId
  });

  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }

  return res.status(result.status || 201).json(result.data);
}

function listMine(req, res) {
  return res.json(appointmentService.listMyAppointments(req.user.id));
}

function cancel(req, res) {
  const result = appointmentService.cancelAppointment({
    userId: req.user.id,
    appointmentId: req.params.id
  });

  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }

  return res.json(result.data);
}

function reschedule(req, res) {
  const { serviceId, slotId } = req.body;
  if (!serviceId || !slotId) {
    return res.status(400).json({ message: "serviceId and slotId are required" });
  }

  const result = appointmentService.rescheduleAppointment({
    userId: req.user.id,
    appointmentId: req.params.id,
    serviceId,
    slotId
  });

  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }

  return res.json(result.data);
}

module.exports = {
  bookAppointment,
  listMine,
  cancel,
  reschedule
};
