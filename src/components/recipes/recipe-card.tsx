"use client";

import Link from "next/link";
import { api } from "@/trpc/react";
import { Badge } from "@/components/ui/badge";
import {
  FavouriteIcon,
  Time01Icon,
  UserMultipleIcon,
  Restaurant01Icon,
} from "hugeicons-react";

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    description: string | null;
    prepTime: number | null;
    cookTime: number | null;
    servings: number | null;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    category: { id: string; name: string } | null;
    tags: { tag: { id: string; name: string } }[];
    images: { url: string; alt: string | null }[];
    _count: { ingredients: number; steps: number };
    favorites: { userId: string }[];
  };
}

const difficultyLabels = {
  EASY: "Facile",
  MEDIUM: "Moyen",
  HARD: "Difficile",
};

const difficultyColors = {
  EASY: "bg-green-100 text-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HARD: "bg-red-100 text-red-800",
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const utils = api.useUtils();
  const isFavorited = recipe.favorites.length > 0;
  const totalTime =
    (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0) || null;

  const toggleFavorite = api.recipe.toggleFavorite.useMutation({
    onSuccess: async () => {
      await utils.recipe.getAll.invalidate();
    },
  });

  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Image ou placeholder */}
      <div className="relative aspect-[4/3] bg-gray-100">
        {recipe.images[0] ? (
          <img
            src={recipe.images[0].url}
            alt={recipe.images[0].alt ?? recipe.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Restaurant01Icon size={48} className="text-gray-300" />
          </div>
        )}

        {/* Bouton favori */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite.mutate(recipe.id);
          }}
          className="absolute right-2 top-2 rounded-full bg-white/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-white"
        >
          <FavouriteIcon
            size={20}
            className={
              isFavorited ? "fill-red-500 text-red-500" : "text-gray-500"
            }
          />
        </button>
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="font-semibold leading-tight group-hover:text-gray-700">
          {recipe.title}
        </h3>

        {recipe.description && (
          <p className="line-clamp-2 text-sm text-gray-500">
            {recipe.description}
          </p>
        )}

        {/* Métadonnées */}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2 text-xs text-gray-500">
          {totalTime && (
            <span className="flex items-center gap-1">
              <Time01Icon size={14} />
              {totalTime} min
            </span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1">
              <UserMultipleIcon size={14} />
              {recipe.servings}
            </span>
          )}
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[recipe.difficulty]}`}
          >
            {difficultyLabels[recipe.difficulty]}
          </span>
        </div>

        {/* Tags */}
        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {recipe.tags.slice(0, 3).map(({ tag }) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
            {recipe.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{recipe.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}