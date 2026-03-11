"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { RecipeFilters } from "@/components/recipes/recipe-filters";
import { Search01Icon } from "hugeicons-react";
import { useDebounce } from "@/lib/use-debounce";

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tagId, setTagId] = useState("");

  const debouncedSearch = useDebounce(search);

const { data: recipes, isLoading } = api.recipe.getAll.useQuery({
  search: debouncedSearch || undefined,
  categoryId: categoryId || undefined,
  difficulty: (difficulty as "EASY" | "MEDIUM" | "HARD") || undefined,
  tagId: tagId || undefined,
});

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Recherche</h1>

      <RecipeFilters
        search={search}
        onSearchChange={setSearch}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        tagId={tagId}
        onTagChange={setTagId}
      />

      <div className="mt-6">
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
            <Search01Icon size={48} className="text-gray-300" />
            <p className="text-gray-500">
              {search || categoryId || difficulty || tagId
                ? "Aucune recette ne correspond à ces critères"
                : "Utilise les filtres pour trouver une recette"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}