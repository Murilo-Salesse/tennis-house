import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type DynamicIdParams =
  | { params: { id: string } }
  | { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: DynamicIdParams) {
  const params = await context.params;
  try {
    const image = await prisma.courtImage.findUnique({
      where: { id: params.id },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, context: DynamicIdParams) {
  const params = await context.params;
  try {
    const body = await request.json();
    const { url, title, order, active } = body;

    const image = await prisma.courtImage.update({
      where: { id: params.id },
      data: {
        ...(url && { url }),
        ...(title !== undefined && { title }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: DynamicIdParams) {
  const params = await context.params;
  try {
    await prisma.courtImage.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Image deleted" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 },
    );
  }
}
