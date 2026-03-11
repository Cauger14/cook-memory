import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/server/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "Aucun fichier envoyé" },
      { status: 400 },
    );
  }

  // Valider le type
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Format non supporté. Utilise JPG, PNG, WebP ou AVIF." },
      { status: 400 },
    );
  }

  // Valider la taille (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: "Le fichier dépasse 5MB." },
      { status: 400 },
    );
  }

  // Upload vers Vercel Blob
  const blob = await put(`recipes/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}