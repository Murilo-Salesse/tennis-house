import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const BUCKET_NAME = "court-images";

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
    const image = await prisma.courtImage.findUnique({
      where: { id: params.id },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseSecretKey =
      process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseSecretKey) {
      const storagePath = getStoragePathFromPublicUrl(image.url);

      if (storagePath) {
        const supabase = createClient(supabaseUrl, supabaseSecretKey, {
          auth: {
            persistSession: false,
          },
        });

        const { error: storageError } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([storagePath]);

        if (storageError) {
          console.error("Error deleting storage image:", storageError);
        }
      }
    }

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

function getStoragePathFromPublicUrl(url: string) {
  try {
    const pathname = new URL(url).pathname;
    const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;
    const markerIndex = pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    return decodeURIComponent(pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}
