import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/server/auth";

export async function POST(request: Request) {
  // Vérifier l'authentification
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

  // Créer le dossier uploads s'il n'existe pas
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  // Générer un nom unique
  const ext = file.name.split(".").pop() ?? "jpg";
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filePath = path.join(uploadDir, uniqueName);

  // Écrire le fichier
  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  const url = `/uploads/${uniqueName}`;
  return NextResponse.json({ url });
}