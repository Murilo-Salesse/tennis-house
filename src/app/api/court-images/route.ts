import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const images = await prisma.courtImage.findMany({
      where: { active: true },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching court images:", error);
    return NextResponse.json(
      { error: "Failed to fetch court images" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, title, order } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const image = await prisma.courtImage.create({
      data: {
        url,
        title: title || "Quadra",
        order: order || 0,
        active: true,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Error creating court image:", error);
    return NextResponse.json(
      { error: "Failed to create court image" },
      { status: 500 },
    );
  }
}
