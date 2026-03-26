const base = "http://localhost:4000/api";

async function req(path, opts = {}) {
  const res = await fetch(base + path, opts);
  const raw = await res.text();
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    body = raw;
  }

  if (!res.ok) {
    throw new Error(`${res.status} ${JSON.stringify(body)}`);
  }

  return body;
}

async function run() {
  const student = await req("/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "student@demo.local", password: "student123" })
  });

  const admin = await req("/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "admin@demo.local", password: "admin123" })
  });

  const services = await req("/services");
  const serviceId = services[0].id;
  const slots = await req(`/slots?serviceId=${serviceId}`);
  const slotId = slots[0].id;

  const booked = await req("/appointments", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${student.token}`
    },
    body: JSON.stringify({ serviceId, slotId })
  });

  const mine = await req("/appointments/mine", {
    headers: { authorization: `Bearer ${student.token}` }
  });

  const queueBefore = await req(`/admin/queue/${slotId}`, {
    headers: { authorization: `Bearer ${admin.token}` }
  });

  const advanced = await req(`/admin/queue/${slotId}/advance`, {
    method: "POST",
    headers: { authorization: `Bearer ${admin.token}` }
  });

  const queueAfter = await req(`/admin/queue/${slotId}`, {
    headers: { authorization: `Bearer ${admin.token}` }
  });

  console.log("student_login", student.user.email, student.user.role);
  console.log("admin_login", admin.user.email, admin.user.role);
  console.log("booked", booked.id, booked.status);
  console.log("mine_count", mine.length);
  console.log("queue_before_waiting", queueBefore.waitingCount);
  console.log("advanced_status", advanced.status);
  console.log("queue_after_waiting", queueAfter.waitingCount);
}

run().catch((err) => {
  console.error("SMOKE_TEST_FAILED", err.message);
  process.exit(1);
});
