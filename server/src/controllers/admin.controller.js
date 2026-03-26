const adminService = require("../services/admin.service");

function getQueue(req, res) {
  const result = adminService.getQueue(req.params.slotId);
  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }
  return res.json(result.data);
}

function advanceQueue(req, res) {
  const result = adminService.advanceQueue(req.params.slotId);
  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }
  return res.json(result.data);
}

module.exports = {
  getQueue,
  advanceQueue
};
