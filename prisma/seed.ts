import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { name: "Entrée", slug: "entree" },
  { name: "Plat", slug: "plat" },
  { name: "Dessert", slug: "dessert" },
  { name: "Apéro", slug: "apero" },
  { name: "Boisson", slug: "boisson" },
  { name: "Petit-déjeuner", slug: "petit-dejeuner" },
  { name: "Sauce", slug: "sauce" },
  { name: "Accompagnement", slug: "accompagnement" },
];

async function main() {
  // Seed categories
  console.log("Seeding categories...");
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }
  console.log(`Seeded ${categories.length} categories.`);

  // Seed admin user
  console.log("Seeding admin user...");
  const hashedPassword = await bcrypt.hash("cookPaddy2002!", 12);

  await prisma.user.upsert({
    where: { email: "clemauger01@gmail.com" },
    update: {},
    create: {
      email: "clemauger01@gmail.com",
      name: "Clément",
      password: hashedPassword,
    },
  });
  console.log("Admin user seeded.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });