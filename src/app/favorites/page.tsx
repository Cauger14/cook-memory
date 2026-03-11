"use client";

import { api } from "@/trpc/react";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { FavouriteIcon } from "hugeicons-react";

export default function FavoritesPage() {
  const { data: recipes, isLoading } = api.recipe.getAll.useQuery({
    favoritesOnly: true,
  });

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="mb-6 text-2xl font-bold">Mes favoris</h1>

      {isLoading ? (
        <p className="text-center text-gray-500">Chargement...</p>
      ) : recipes && recipes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-20 text-center">
          <FavouriteIcon size={48} className="text-gray-300" />
          <h2 className="text-lg font-medium text-gray-900">
            Pas encore de favoris
          </h2>
          <p className="text-sm text-gray-500">
            Clique sur le cœur d&apos;une recette pour l&apos;ajouter ici
          </p>
        </div>
      )}
    </div>
  );
}