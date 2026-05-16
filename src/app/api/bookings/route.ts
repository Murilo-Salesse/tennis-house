import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        client: true,
        timeSlot: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, clientEmail, clientPhone, timeSlotId, date } = body;

    // Validar dados
    if (!clientName || !clientEmail || !clientPhone || !timeSlotId || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Criar ou buscar cliente
    let client = await prisma.client.findUnique({
      where: { email: clientEmail },
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
        },
      });
    }

    // Buscar time slot
    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id: timeSlotId },
    });

    if (!timeSlot) {
      return NextResponse.json(
        { error: "Time slot not found" },
        { status: 404 },
      );
    }

    // Criar reserva
    const booking = await prisma.booking.create({
      data: {
        clientId: client.id,
        timeSlotId: timeSlotId,
        date: new Date(date),
        status: "pending",
        value: timeSlot.price,
      },
      include: {
        client: true,
        timeSlot: true,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
