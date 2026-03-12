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

const tags = [
  { name: "Végétarien", slug: "vegetarien" },
  { name: "Rapide", slug: "rapide" },
  { name: "Été", slug: "ete" },
  { name: "Comfort food", slug: "comfort-food" },
  { name: "Healthy", slug: "healthy" },
  { name: "Sans gluten", slug: "sans-gluten" },
];

async function main() {
  // ── Catégories ──
  console.log("Seeding categories...");
  const seededCategories: Record<string, string> = {};
  for (const category of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
    seededCategories[category.slug] = cat.id;
  }
  console.log(`Seeded ${categories.length} categories.`);

  // ── Tags ──
  console.log("Seeding tags...");
  const seededTags: Record<string, string> = {};
  for (const tag of tags) {
    const t = await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: { name: tag.name },
      create: tag,
    });
    seededTags[tag.slug] = t.id;
  }
  console.log(`Seeded ${tags.length} tags.`);

  // ── User ──
  console.log("Seeding admin user...");
  const hashedPassword = await bcrypt.hash("exemplePassword", 12);
  const user = await prisma.user.upsert({
    where: { email: "clemauger01@gmail.com" },
    update: {},
    create: {
      email: "clemauger01@gmail.com",
      name: "Clément",
      password: hashedPassword,
    },
  });
  console.log("Admin user seeded.");

  // ── Recettes ──
  console.log("Seeding recipes...");

  // Supprimer les anciennes recettes du seed (pour pouvoir re-seed)
  await prisma.recipe.deleteMany({ where: { userId: user.id } });

  // 1. Pâtes carbonara
  const carbonara = await prisma.recipe.create({
    data: {
      title: "Pâtes à la carbonara",
      description:
        "La vraie recette italienne, sans crème. Juste des œufs, du guanciale et du pecorino.",
      prepTime: 10,
      cookTime: 15,
      servings: 4,
      difficulty: "MEDIUM",
      userId: user.id,
      categoryId: seededCategories["plat"],
      ingredients: {
        create: [
          { name: "Spaghetti", quantity: "400", unit: "g", order: 0 },
          { name: "Guanciale", quantity: "200", unit: "g", order: 1 },
          { name: "Jaunes d'œufs", quantity: "6", unit: "", order: 2 },
          { name: "Pecorino romano", quantity: "100", unit: "g", order: 3 },
          { name: "Poivre noir", quantity: "", unit: "", order: 4 },
        ],
      },
      steps: {
        create: [
          {
            instruction:
              "Couper le guanciale en lardons épais et le faire revenir à sec dans une poêle jusqu'à ce qu'il soit croustillant.",
            order: 0,
          },
          {
            instruction:
              "Mélanger les jaunes d'œufs avec le pecorino râpé et une bonne dose de poivre noir.",
            order: 1,
          },
          {
            instruction:
              "Cuire les pâtes al dente dans une grande quantité d'eau salée.",
            order: 2,
          },
          {
            instruction:
              "Égoutter les pâtes en gardant un peu d'eau de cuisson. Les verser dans la poêle avec le guanciale hors du feu.",
            order: 3,
          },
          {
            instruction:
              "Ajouter le mélange œufs-fromage, mélanger vivement. Ajouter un peu d'eau de cuisson si nécessaire pour obtenir une sauce crémeuse.",
            order: 4,
          },
        ],
      },
      tags: {
        create: [{ tagId: seededTags["comfort-food"]! }],
      },
    },
  });

  // 2. Salade César
  const cesar = await prisma.recipe.create({
    data: {
      title: "Salade César",
      description:
        "Croquante, fraîche et savoureuse. Un classique indémodable.",
      prepTime: 15,
      cookTime: 5,
      servings: 2,
      difficulty: "EASY",
      userId: user.id,
      categoryId: seededCategories["entree"],
      ingredients: {
        create: [
          { name: "Laitue romaine", quantity: "1", unit: "pièce", order: 0 },
          { name: "Poulet grillé", quantity: "200", unit: "g", order: 1 },
          { name: "Parmesan", quantity: "50", unit: "g", order: 2 },
          { name: "Croûtons", quantity: "100", unit: "g", order: 3 },
          { name: "Sauce César", quantity: "4", unit: "c.à.s", order: 4 },
        ],
      },
      steps: {
        create: [
          {
            instruction: "Laver et couper la laitue en morceaux.",
            order: 0,
          },
          {
            instruction:
              "Griller le poulet et le trancher en lamelles.",
            order: 1,
          },
          {
            instruction:
              "Assembler la salade : laitue, poulet, croûtons, copeaux de parmesan.",
            order: 2,
          },
          {
            instruction: "Napper de sauce César et servir immédiatement.",
            order: 3,
          },
        ],
      },
      tags: {
        create: [
          { tagId: seededTags["rapide"]! },
          { tagId: seededTags["healthy"]! },
        ],
      },
    },
  });

  // 3. Fondant au chocolat
  const fondant = await prisma.recipe.create({
    data: {
      title: "Fondant au chocolat",
      description:
        "Cœur coulant et croûte craquante. Le dessert parfait pour les amoureux du chocolat.",
      prepTime: 15,
      cookTime: 12,
      servings: 6,
      difficulty: "MEDIUM",
      userId: user.id,
      categoryId: seededCategories["dessert"],
      ingredients: {
        create: [
          { name: "Chocolat noir 70%", quantity: "200", unit: "g", order: 0 },
          { name: "Beurre", quantity: "100", unit: "g", order: 1 },
          { name: "Œufs", quantity: "4", unit: "", order: 2 },
          { name: "Sucre", quantity: "80", unit: "g", order: 3 },
          { name: "Farine", quantity: "30", unit: "g", order: 4 },
        ],
      },
      steps: {
        create: [
          {
            instruction:
              "Préchauffer le four à 200°C. Beurrer et fariner les moules individuels.",
            order: 0,
          },
          {
            instruction:
              "Faire fondre le chocolat et le beurre au bain-marie ou au micro-ondes.",
            order: 1,
          },
          {
            instruction:
              "Fouetter les œufs et le sucre jusqu'à ce que le mélange blanchisse.",
            order: 2,
          },
          {
            instruction:
              "Incorporer le chocolat fondu puis la farine délicatement.",
            order: 3,
          },
          {
            instruction:
              "Répartir dans les moules et enfourner 10-12 minutes. Le centre doit rester tremblotant.",
            order: 4,
          },
        ],
      },
      tags: {
        create: [{ tagId: seededTags["comfort-food"]! }],
      },
    },
  });

  // 4. Gaspacho
  const gaspacho = await prisma.recipe.create({
    data: {
      title: "Gaspacho andalou",
      description:
        "Soupe froide de tomates, rafraîchissante et parfaite pour l'été.",
      prepTime: 15,
      cookTime: 0,
      servings: 4,
      difficulty: "EASY",
      userId: user.id,
      categoryId: seededCategories["entree"],
      ingredients: {
        create: [
          { name: "Tomates bien mûres", quantity: "1", unit: "kg", order: 0 },
          { name: "Concombre", quantity: "1", unit: "pièce", order: 1 },
          { name: "Poivron rouge", quantity: "1", unit: "pièce", order: 2 },
          { name: "Gousse d'ail", quantity: "1", unit: "", order: 3 },
          { name: "Huile d'olive", quantity: "4", unit: "c.à.s", order: 4 },
          { name: "Vinaigre de xérès", quantity: "2", unit: "c.à.s", order: 5 },
          { name: "Sel", quantity: "", unit: "", order: 6 },
        ],
      },
      steps: {
        create: [
          {
            instruction:
              "Laver et couper grossièrement les tomates, le concombre et le poivron.",
            order: 0,
          },
          {
            instruction:
              "Mixer tous les légumes avec l'ail, l'huile d'olive et le vinaigre jusqu'à obtenir une texture lisse.",
            order: 1,
          },
          {
            instruction:
              "Saler, goûter et ajuster l'assaisonnement. Réfrigérer au moins 2 heures.",
            order: 2,
          },
          {
            instruction:
              "Servir bien frais avec un filet d'huile d'olive et des petits dés de légumes.",
            order: 3,
          },
        ],
      },
      tags: {
        create: [
          { tagId: seededTags["vegetarien"]! },
          { tagId: seededTags["ete"]! },
          { tagId: seededTags["healthy"]! },
          { tagId: seededTags["sans-gluten"]! },
        ],
      },
    },
  });

  // 5. Croque-monsieur
  const croque = await prisma.recipe.create({
    data: {
      title: "Croque-monsieur",
      description:
        "Le classique du bistrot français. Croustillant dehors, fondant dedans.",
      prepTime: 5,
      cookTime: 10,
      servings: 2,
      difficulty: "EASY",
      userId: user.id,
      categoryId: seededCategories["plat"],
      ingredients: {
        create: [
          { name: "Pain de mie", quantity: "4", unit: "tranches", order: 0 },
          { name: "Jambon blanc", quantity: "4", unit: "tranches", order: 1 },
          { name: "Gruyère râpé", quantity: "100", unit: "g", order: 2 },
          { name: "Béchamel", quantity: "100", unit: "ml", order: 3 },
          { name: "Beurre", quantity: "20", unit: "g", order: 4 },
        ],
      },
      steps: {
        create: [
          {
            instruction:
              "Tartiner les tranches de pain de béchamel.",
            order: 0,
          },
          {
            instruction:
              "Déposer le jambon et une partie du gruyère sur deux tranches, refermer avec les deux autres.",
            order: 1,
          },
          {
            instruction:
              "Parsemer le dessus de gruyère râpé et ajouter une noisette de beurre.",
            order: 2,
          },
          {
            instruction:
              "Enfourner à 200°C pendant 10 minutes jusqu'à ce que le fromage soit doré et gratiné.",
            order: 3,
          },
        ],
      },
      tags: {
        create: [
          { tagId: seededTags["rapide"]! },
          { tagId: seededTags["comfort-food"]! },
        ],
      },
    },
  });

  console.log(
    `Seeded 5 recipes: ${carbonara.title}, ${cesar.title}, ${fondant.title}, ${gaspacho.title}, ${croque.title}`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
