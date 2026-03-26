import { prisma } from "./src/lib/prisma";

async function checkConnection() {
  try {
    await prisma.$connect();
    console.log("Database connection successful!");
    const userCount = await prisma.user.count();
    console.log(`Current user count: ${userCount}`);
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkConnection();
