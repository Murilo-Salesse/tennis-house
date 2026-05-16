import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

const BUCKET_NAME = "court-images";

function createSupabaseAdminClient(url: string, serviceRoleKey: string) {
  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}

async function ensureBucket(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
): Promise<NextResponse | null> {
  const { data: bucket, error: getBucketError } =
    await supabase.storage.getBucket(BUCKET_NAME);

  if (!getBucketError) {
    if (!bucket.public) {
      const { error: updateBucketError } = await supabase.storage.updateBucket(
        BUCKET_NAME,
        { public: true },
      );

      if (updateBucketError) {
        console.error("Supabase bucket update error:", updateBucketError);
        return NextResponse.json(
          { error: "Nao foi possivel tornar o bucket de imagens publico." },
          { status: 500 },
        );
      }
    }

    return null;
  }

  const bucketNotFound =
    getBucketError.message.toLowerCase().includes("not found") ||
    getBucketError.message.toLowerCase().includes("does not exist");

  if (!bucketNotFound) {
    console.error("Supabase bucket check error:", getBucketError);
    return NextResponse.json(
      { error: "Nao foi possivel validar o bucket de imagens no Supabase." },
      { status: 500 },
    );
  }

  const { error: createBucketError } = await supabase.storage.createBucket(
    BUCKET_NAME,
    {
      public: true,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      fileSizeLimit: 1024 * 1024 * 8,
    },
  );

  if (createBucketError) {
    console.error("Supabase bucket create error:", createBucketError);
    return NextResponse.json(
      { error: "Nao foi possivel criar o bucket 'court-images' no Supabase." },
      { status: 500 },
    );
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseSecretKey =
      process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
      return NextResponse.json(
        {
          error:
            "Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SECRET_KEY para enviar imagens.",
        },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Envie um arquivo de imagem valido." },
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdminClient(
      supabaseUrl,
      supabaseSecretKey,
    );

    const bucketErrorResponse = await ensureBucket(supabase);
    if (bucketErrorResponse) {
      return bucketErrorResponse;
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `quadra-${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "Nao foi possivel enviar a imagem para o Supabase Storage." },
        { status: 500 },
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    const newImage = await prisma.courtImage.create({
      data: {
        url: publicUrlData.publicUrl,
        title: title || file.name,
        active: true,
      },
    });

    return NextResponse.json({ success: true, image: newImage }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar imagem." },
      { status: 500 },
    );
  }
}
