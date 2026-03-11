"use client";

import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { RecipeForm } from "@/components/recipes/recipe-form";

export default function EditRecipePage() {
  const params = useParams<{ id: string }>();
  const { data: recipe, isLoading } = api.recipe.getById.useQuery(params.id);

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

  return <RecipeForm initialData={recipe} />;
}