const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@university.edu" },
    update: {},
    create: {
      email: "admin@university.edu",
      name: "System Administrator",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Create Services
  const services = [
    {
      name: "Chemistry Lab",
      description: "Laboratory access for chemical experiments and research.",
      duration: 60,
    },
    {
      name: "Medical Consultation",
      description: "General health checkup and medical advice.",
      duration: 15,
    },
    {
      name: "Administrative Office",
      description: "Docmentation, fee payments, and academic inquiries.",
      duration: 10,
    },
  ];

  for (const s of services) {
    const service = await prisma.service.create({
      data: {
        name: s.name,
        description: s.description,
        duration: s.duration,
        slots: {
          create: [
            {
              startTime: new Date(new Date().setHours(9, 0, 0, 0)),
              endTime: new Date(new Date().setHours(10, 0, 0, 0)),
              capacity: 5,
            },
            {
              startTime: new Date(new Date().setHours(10, 0, 0, 0)),
              endTime: new Date(new Date().setHours(11, 0, 0, 0)),
              capacity: 5,
            },
            {
              startTime: new Date(new Date().setHours(11, 0, 0, 0)),
              endTime: new Date(new Date().setHours(12, 0, 0, 0)),
              capacity: 5,
            },
          ],
        },
      },
    });
    console.log(`Created service: ${service.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
