"use client";

import { api } from "@/trpc/react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search01Icon, Cancel01Icon } from "hugeicons-react";
import { Button } from "@/components/ui/button";

interface RecipeFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  difficulty: string;
  onDifficultyChange: (value: string) => void;
  tagId: string;
  onTagChange: (value: string) => void;
}

export function RecipeFilters({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  difficulty,
  onDifficultyChange,
  tagId,
  onTagChange,
}: RecipeFiltersProps) {
  const { data: categories } = api.category.getAll.useQuery();
  const { data: tags } = api.tag.getAll.useQuery();

  const hasActiveFilters = categoryId || difficulty || tagId;

  function clearFilters() {
    onCategoryChange("");
    onDifficultyChange("");
    onTagChange("");
  }

  return (
    <div className="space-y-3">
      {/* Barre de recherche */}
      <div className="relative">
        <Search01Icon
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <Input
          placeholder="Rechercher par titre, description, ingrédient..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtres en ligne */}
      <div className="flex flex-wrap items-center gap-2">
        <Select value={categoryId} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name} ({cat._count.recipes})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={difficulty} onValueChange={onDifficultyChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Difficulté" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EASY">Facile</SelectItem>
            <SelectItem value="MEDIUM">Moyen</SelectItem>
            <SelectItem value="HARD">Difficile</SelectItem>
          </SelectContent>
        </Select>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => onTagChange(tagId === tag.id ? "" : tag.id)}
                className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                  tagId === tag.id
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-gray-500"
          >
            <Cancel01Icon size={14} className="mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>
    </div>
  );
}