import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type DynamicIdParams =
  | { params: { id: string } }
  | { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: DynamicIdParams) {
  const params = await context.params;
  try {
    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id: params.id },
    });

    if (!timeSlot) {
      return NextResponse.json(
        { error: "Time slot not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(timeSlot);
  } catch (error) {
    console.error("Error fetching time slot:", error);
    return NextResponse.json(
      { error: "Failed to fetch time slot" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, context: DynamicIdParams) {
  const params = await context.params;
  try {
    const body = await request.json();
    const { price, available } = body;

    const timeSlot = await prisma.timeSlot.update({
      where: { id: params.id },
      data: {
        ...(price !== undefined && { price }),
        ...(available !== undefined && { available }),
      },
    });

    return NextResponse.json(timeSlot);
  } catch (error) {
    console.error("Error updating time slot:", error);
    return NextResponse.json(
      { error: "Failed to update time slot" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: DynamicIdParams) {
  const params = await context.params;
  try {
    await prisma.timeSlot.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Time slot deleted" });
  } catch (error) {
    console.error("Error deleting time slot:", error);
    return NextResponse.json(
      { error: "Failed to delete time slot" },
      { status: 500 },
    );
  }
}
