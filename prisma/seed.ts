import { PrismaClient } from "@prisma/client";

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
  console.log("Seeding categories...");

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }

  console.log(`Seeded ${categories.length} categories.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });