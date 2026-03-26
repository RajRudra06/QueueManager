import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: {
        slots: {
          orderBy: { startTime: "asc" },
        },
      },
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, duration, slots } = await req.json();

    const service = await prisma.service.create({
      data: {
        name,
        description,
        duration,
        slots: {
          create: slots.map((slot: any) => ({
            startTime: new Date(slot.startTime),
            endTime: new Date(slot.endTime),
            capacity: slot.capacity,
          })),
        },
      },
      include: { slots: true },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Service creation error:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
