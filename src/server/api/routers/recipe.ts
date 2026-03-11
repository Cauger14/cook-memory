import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

// ── Schemas de validation ──────────────────────────

const ingredientSchema = z.object({
  name: z.string().min(1),
  quantity: z.string().optional(),
  unit: z.string().optional(),
  order: z.number().int().min(0),
});

const stepSchema = z.object({
  instruction: z.string().min(1),
  order: z.number().int().min(0),
});

const createRecipeSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  prepTime: z.number().int().positive().optional(),
  cookTime: z.number().int().positive().optional(),
  servings: z.number().int().positive().optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
  categoryId: z.string().optional(),
  ingredients: z.array(ingredientSchema).default([]),
  steps: z.array(stepSchema).default([]),
  tagIds: z.array(z.string()).default([]),
});

const updateRecipeSchema = createRecipeSchema.partial().extend({
  id: z.string(),
});

// ── Router ─────────────────────────────────────────

export const recipeRouter = createTRPCRouter({
  // Liste des recettes de l'utilisateur
  getAll: protectedProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
        difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
        search: z.string().optional(),
        tagId: z.string().optional(),
        favoritesOnly: z.boolean().default(false),
      }).default({}),
    )
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = {
        userId: ctx.session.user.id,
      };

      if (input.categoryId) where.categoryId = input.categoryId;
      if (input.difficulty) where.difficulty = input.difficulty;
      if (input.tagId) {
        where.tags = { some: { tagId: input.tagId } };
      }
      if (input.search) {
        where.OR = [
          { title: { contains: input.search, mode: "insensitive" } },
          { description: { contains: input.search, mode: "insensitive" } },
          {
            ingredients: {
              some: {
                name: { contains: input.search, mode: "insensitive" },
              },
            },
          },
        ];
      }
      if (input.favoritesOnly) {
        where.favorites = {
          some: { userId: ctx.session.user.id },
        };
      }

      return ctx.db.recipe.findMany({
        where,
        include: {
          category: true,
          tags: { include: { tag: true } },
          images: { orderBy: { order: "asc" }, take: 1 },
          _count: { select: { ingredients: true, steps: true } },
          favorites: {
            where: { userId: ctx.session.user.id },
            select: { userId: true },
          },
        },
        orderBy: { updatedAt: "desc" },
      });
    }),

  // Détail d'une recette
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const recipe = await ctx.db.recipe.findUnique({
        where: { id: input, userId: ctx.session.user.id },
        include: {
          category: true,
          tags: { include: { tag: true } },
          ingredients: { orderBy: { order: "asc" } },
          steps: { orderBy: { order: "asc" } },
          images: { orderBy: { order: "asc" } },
          favorites: {
            where: { userId: ctx.session.user.id },
            select: { userId: true },
          },
        },
      });

      if (!recipe) throw new Error("Recette introuvable");
      return recipe;
    }),

  // Créer une recette
  create: protectedProcedure
    .input(createRecipeSchema)
    .mutation(async ({ ctx, input }) => {
      const { ingredients, steps, tagIds, ...data } = input;

      return ctx.db.recipe.create({
        data: {
          ...data,
          userId: ctx.session.user.id,
          ingredients: {
            create: ingredients,
          },
          steps: {
            create: steps,
          },
          tags: {
            create: tagIds.map((tagId) => ({ tagId })),
          },
        },
      });
    }),

  // Modifier une recette
  update: protectedProcedure
    .input(updateRecipeSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ingredients, steps, tagIds, ...data } = input;

      // Vérifie que la recette appartient à l'utilisateur
      const existing = await ctx.db.recipe.findUnique({
        where: { id, userId: ctx.session.user.id },
      });
      if (!existing) throw new Error("Recette introuvable");

      // Met à jour dans une transaction pour la cohérence
      return ctx.db.$transaction(async (tx) => {
        // Supprime les anciens ingrédients/steps/tags si fournis
        if (ingredients) {
          await tx.ingredient.deleteMany({ where: { recipeId: id } });
        }
        if (steps) {
          await tx.step.deleteMany({ where: { recipeId: id } });
        }
        if (tagIds) {
          await tx.recipeTag.deleteMany({ where: { recipeId: id } });
        }

        return tx.recipe.update({
          where: { id },
          data: {
            ...data,
            ...(ingredients && {
              ingredients: { create: ingredients },
            }),
            ...(steps && {
              steps: { create: steps },
            }),
            ...(tagIds && {
              tags: { create: tagIds.map((tagId) => ({ tagId })) },
            }),
          },
        });
      });
    }),

  // Supprimer une recette
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.recipe.delete({
        where: { id: input, userId: ctx.session.user.id },
      });
    }),

  // Toggle favori
  toggleFavorite: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.favorite.findUnique({
        where: {
          userId_recipeId: {
            userId: ctx.session.user.id,
            recipeId: input,
          },
        },
      });

      if (existing) {
        await ctx.db.favorite.delete({
          where: {
            userId_recipeId: {
              userId: ctx.session.user.id,
              recipeId: input,
            },
          },
        });
        return { favorited: false };
      } else {
        await ctx.db.favorite.create({
          data: {
            userId: ctx.session.user.id,
            recipeId: input,
          },
        });
        return { favorited: true };
      }
    }),
});