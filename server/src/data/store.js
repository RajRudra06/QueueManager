const { randomUUID } = require("crypto");
const bcrypt = require("bcryptjs");

const now = Date.now();

const users = [
  {
    id: randomUUID(),
    name: "Admin User",
    email: "admin@demo.local",
    role: "ADMIN",
    passwordHash: bcrypt.hashSync("admin123", 12),
    createdAt: new Date(now).toISOString()
  },
  {
    id: randomUUID(),
    name: "Student User",
    email: "student@demo.local",
    role: "STUDENT",
    passwordHash: bcrypt.hashSync("student123", 12),
    createdAt: new Date(now).toISOString()
  }
];

const services = [
  {
    id: randomUUID(),
    name: "Laboratory Access",
    description: "Book lab usage slots",
    active: true,
    createdAt: new Date(now).toISOString()
  },
  {
    id: randomUUID(),
    name: "Medical Consultation",
    description: "Visit campus clinic",
    active: true,
    createdAt: new Date(now).toISOString()
  }
];

const slots = [
  {
    id: randomUUID(),
    serviceId: services[0].id,
    label: "09:00-09:30",
    capacity: 3,
    startsAt: new Date(now + 60 * 60 * 1000).toISOString(),
    createdAt: new Date(now).toISOString()
  },
  {
    id: randomUUID(),
    serviceId: services[0].id,
    label: "10:00-10:30",
    capacity: 3,
    startsAt: new Date(now + 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(now).toISOString()
  },
  {
    id: randomUUID(),
    serviceId: services[1].id,
    label: "11:00-11:30",
    capacity: 2,
    startsAt: new Date(now + 3 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(now).toISOString()
  }
];

const appointments = [];

function nextId() {
  return randomUUID();
}

module.exports = {
  users,
  services,
  slots,
  appointments,
  nextId
};
