import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slotId } = await req.json();

    if (!slotId) {
      return NextResponse.json({ error: "Slot ID is required" }, { status: 400 });
    }

    const slot = await prisma.timeSlot.findUnique({
      where: { id: slotId },
      include: { 
        _count: {
          select: { appointments: true }
        }
      }
    });

    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    if (slot._count.appointments >= slot.capacity) {
      return NextResponse.json({ error: "Slot is full" }, { status: 400 });
    }

    // Atomic transaction to ensure queue position consistency
    const appointment = await prisma.$transaction(async (tx) => {
      const existingCount = await tx.appointment.count({
        where: { slotId, status: "PENDING" },
      });

      return await tx.appointment.create({
        data: {
          userId: (session.user as any).id,
          slotId,
          queuePosition: existingCount + 1,
          status: "PENDING",
        },
      });
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appointments = await prisma.appointment.findMany({
      where: { userId: (session.user as any).id },
      include: {
        slot: {
          include: { service: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}
