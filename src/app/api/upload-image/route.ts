import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

// Usamos a SERVICE_ROLE_KEY para ter permissão de upload ignorando RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    // 1. Converter File em Buffer para o Supabase
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Gerar um nome único para o arquivo
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExt = file.name.split('.').pop();
    const fileName = `quadra-${uniqueSuffix}.${fileExt}`;

    // 2. Fazer o upload para o Supabase Storage (bucket: court-images)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("court-images")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase Upload Error:", uploadError);
      return NextResponse.json(
        { error: "Erro ao fazer upload no Supabase. Verifique se o bucket 'court-images' existe e se as chaves estão corretas." },
        { status: 500 }
      );
    }

    // 3. Pegar a URL pública da imagem
    const { data: publicUrlData } = supabase.storage
      .from("court-images")
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    // 4. Salvar no banco de dados via Prisma
    const newImage = await prisma.courtImage.create({
      data: {
        url: publicUrl,
        title: title || file.name,
        active: true,
      },
    });

    return NextResponse.json({ success: true, image: newImage }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar imagem." },
      { status: 500 }
    );
  }
}
