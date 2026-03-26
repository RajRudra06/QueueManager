import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appointments = await prisma.appointment.findMany({
      include: {
        user: { select: { name: true, email: true } },
        slot: { include: { service: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch all appointments" }, { status: 500 });
  }
}
