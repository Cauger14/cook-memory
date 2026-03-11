"use client";

import { api } from "@/trpc/react";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { Restaurant01Icon } from "hugeicons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Add01Icon } from "hugeicons-react";

export default function HomePage() {
  const { data: recipes, isLoading } = api.recipe.getAll.useQuery({});

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes recettes</h1>
        <Link href="/recipes/new">
          <Button>
            <Add01Icon size={16} className="mr-1" /> Nouvelle recette
          </Button>
        </Link>
      </div>

      {recipes && recipes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <Restaurant01Icon size={64} className="text-gray-300" />
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Aucune recette pour le moment
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Commence par ajouter ta première recette !
            </p>
          </div>
          <Link href="/recipes/new">
            <Button>
              <Add01Icon size={16} className="mr-1" /> Créer une recette
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}