"use client";

import { useParams, useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FavouriteIcon,
  Time01Icon,
  UserMultipleIcon,
  Edit01Icon,
  Delete02Icon,
  ArrowLeft01Icon,
} from "hugeicons-react";

const difficultyLabels = {
  EASY: "Facile",
  MEDIUM: "Moyen",
  HARD: "Difficile",
};

export default function RecipeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data: recipe, isLoading } = api.recipe.getById.useQuery(params.id);
  const utils = api.useUtils();

  const toggleFavorite = api.recipe.toggleFavorite.useMutation({
    onSuccess: async () => {
      await utils.recipe.getById.invalidate(params.id);
      await utils.recipe.getAll.invalidate();
    },
  });

  const deleteMutation = api.recipe.delete.useMutation({
    onSuccess: async () => {
      await utils.recipe.getAll.invalidate();
      router.push("/");
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Recette introuvable</p>
      </div>
    );
  }

  const isFavorited = recipe.favorites.length > 0;
  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0) || null;

  function handleDelete() {
    if (window.confirm("Supprimer cette recette ?")) {
      deleteMutation.mutate(recipe!.id);
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft01Icon size={20} />
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleFavorite.mutate(recipe.id)}
        >
          <FavouriteIcon
            size={22}
            className={
              isFavorited ? "fill-red-500 text-red-500" : "text-gray-500"
            }
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/recipes/${recipe.id}/edit`)}
        >
          <Edit01Icon size={20} />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleDelete}>
          <Delete02Icon size={20} className="text-red-500" />
        </Button>
      </div>

      {/* Titre & description */}
      <h1 className="text-3xl font-bold">{recipe.title}</h1>
      {recipe.description && (
        <p className="mt-2 text-gray-600">{recipe.description}</p>
      )}

      {/* Métadonnées */}
      <div className="mt-4 flex flex-wrap gap-3">
        {recipe.category && (
          <Badge variant="outline">{recipe.category.name}</Badge>
        )}
        <Badge
          variant="secondary"
          className={
            recipe.difficulty === "EASY"
              ? "bg-green-100 text-green-800"
              : recipe.difficulty === "MEDIUM"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }
        >
          {difficultyLabels[recipe.difficulty]}
        </Badge>
        {totalTime && (
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Time01Icon size={16} /> {totalTime} min
            {recipe.prepTime && recipe.cookTime && (
              <span className="text-xs">
                ({recipe.prepTime} prép. + {recipe.cookTime} cuisson)
              </span>
            )}
          </span>
        )}
        {recipe.servings && (
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <UserMultipleIcon size={16} /> {recipe.servings} portions
          </span>
        )}
      </div>

      {/* Tags */}
      {recipe.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {recipe.tags.map(({ tag }) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      <Separator className="my-6" />

      {/* Ingrédients */}
      {recipe.ingredients.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-lg font-semibold">Ingrédients</h2>
          <ul className="space-y-1.5">
            {recipe.ingredients.map((ing) => (
              <li key={ing.id} className="flex gap-2 text-sm">
                <span className="font-medium text-gray-900">
                  {[ing.quantity, ing.unit].filter(Boolean).join(" ")}
                </span>
                <span className="text-gray-600">{ing.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Étapes */}
      {recipe.steps.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-lg font-semibold">Préparation</h2>
          <ol className="space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={step.id} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-medium text-white">
                  {index + 1}
                </span>
                <p className="pt-0.5 text-sm text-gray-700">
                  {step.instruction}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}