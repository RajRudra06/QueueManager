import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slotId } = await req.json();

    if (!slotId) {
      return NextResponse.json({ error: "Slot ID is required" }, { status: 400 });
    }

    // Find the current active appointment (lowest queue position)
    const activeApt = await prisma.appointment.findFirst({
      where: { slotId, status: "PENDING" },
      orderBy: { queuePosition: "asc" },
    });

    if (!activeApt) {
      return NextResponse.json({ error: "No active appointments found" }, { status: 404 });
    }

    // Mark current as COMPLETED
    await prisma.appointment.update({
      where: { id: activeApt.id },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json({ success: true, completedId: activeApt.id });
  } catch (error) {
    console.error("Advance queue error:", error);
    return NextResponse.json({ error: "Failed to advance queue" }, { status: 500 });
  }
}
