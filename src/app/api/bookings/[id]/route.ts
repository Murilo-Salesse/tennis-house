import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type DynamicIdParams =
  | { params: { id: string } }
  | { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: DynamicIdParams) {
  const params = await context.params;
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        timeSlot: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, context: DynamicIdParams) {
  const params = await context.params;
  try {
    const body = await request.json();
    const { status, notes } = body;

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        client: true,
        timeSlot: true,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: DynamicIdParams) {
  const params = await context.params;
  try {
    await prisma.booking.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Booking deleted" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 },
    );
  }
}
