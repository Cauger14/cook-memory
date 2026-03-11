"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Add01Icon,
  Delete02Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from "hugeicons-react";
import { ImageUpload } from "@/components/recipes/image-upload";

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  order: number;
}

interface Step {
  instruction: string;
  order: number;
}

interface RecipeFormProps {
  initialData?: {
    id: string;
    title: string;
    description: string | null;
    prepTime: number | null;
    cookTime: number | null;
    servings: number | null;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    categoryId: string | null;
    ingredients: Ingredient[];
    steps: Step[];
    tags: { tag: { id: string; name: string } }[];
  };
}

export function RecipeForm({ initialData }: RecipeFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [prepTime, setPrepTime] = useState(
    initialData?.prepTime?.toString() ?? "",
  );
  const [cookTime, setCookTime] = useState(
    initialData?.cookTime?.toString() ?? "",
  );
  const [servings, setServings] = useState(
    initialData?.servings?.toString() ?? "",
  );
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">(
    initialData?.difficulty ?? "MEDIUM",
  );
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId ?? "",
  );
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialData?.ingredients ?? [{ name: "", quantity: "", unit: "", order: 0 }],
  );
  const [steps, setSteps] = useState<Step[]>(
    initialData?.steps ?? [{ instruction: "", order: 0 }],
  );
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialData?.tags.map((t) => t.tag.id) ?? [],
  );

  const { data: categories } = api.category.getAll.useQuery();
  const { data: tags } = api.tag.getAll.useQuery();
  const utils = api.useUtils();
  const [imageUrls, setImageUrls] = useState<string[]>(
  initialData?.images?.map((img) => img.url) ?? [],
);

  const createMutation = api.recipe.create.useMutation({
    onSuccess: async () => {
      await utils.recipe.getAll.invalidate();
      router.push("/");
    },
  });

  const updateMutation = api.recipe.update.useMutation({
    onSuccess: async () => {
      await utils.recipe.getAll.invalidate();
      if (initialData) {
        await utils.recipe.getById.invalidate(initialData.id);
        router.push(`/recipes/${initialData.id}`);
      }
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  // ── Ingredients helpers ──
  function addIngredient() {
    setIngredients([
      ...ingredients,
      { name: "", quantity: "", unit: "", order: ingredients.length },
    ]);
  }

  function removeIngredient(index: number) {
    setIngredients(
      ingredients
        .filter((_, i) => i !== index)
        .map((ing, i) => ({ ...ing, order: i })),
    );
  }

  function updateIngredient(
    index: number,
    field: keyof Ingredient,
    value: string,
  ) {
    setIngredients(
      ingredients.map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing,
      ),
    );
  }

  // ── Steps helpers ──
  function addStep() {
    setSteps([...steps, { instruction: "", order: steps.length }]);
  }

  function removeStep(index: number) {
    setSteps(
      steps
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, order: i })),
    );
  }

  function moveStep(index: number, direction: "up" | "down") {
    const newSteps = [...steps];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;

    const temp = newSteps[targetIndex]!;
    newSteps[targetIndex] = newSteps[index]!;
    newSteps[index] = temp;

    setSteps(newSteps.map((step, i) => ({ ...step, order: i })));
  }

  function toggleTag(tagId: string) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  }

  // ── Submit ──
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const filteredIngredients = ingredients.filter((ing) => ing.name.trim());
    const filteredSteps = steps.filter((step) => step.instruction.trim());

    const data = {
      title,
      description: description || undefined,
      prepTime: prepTime ? parseInt(prepTime) : undefined,
      cookTime: cookTime ? parseInt(cookTime) : undefined,
      servings: servings ? parseInt(servings) : undefined,
      difficulty,
      categoryId: categoryId || undefined,
      ingredients: filteredIngredients,
      steps: filteredSteps,
      tagIds: selectedTagIds,
      imageUrls,
    };

    if (isEditing && initialData) {
      updateMutation.mutate({ id: initialData.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8 p-4">
      <h1 className="text-2xl font-bold">
        {isEditing ? "Modifier la recette" : "Nouvelle recette"}
      </h1>

      {/* ── Infos principales ── */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Risotto aux champignons"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Une courte description de la recette..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <Label htmlFor="prepTime">Préparation (min)</Label>
            <Input
              id="prepTime"
              type="number"
              min="0"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cookTime">Cuisson (min)</Label>
            <Input
              id="cookTime"
              type="number"
              min="0"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="servings">Portions</Label>
            <Input
              id="servings"
              type="number"
              min="1"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
            />
          </div>
          <div>
            <Label>Difficulté</Label>
            <Select
              value={difficulty}
              onValueChange={(v) =>
                setDifficulty(v as "EASY" | "MEDIUM" | "HARD")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EASY">Facile</SelectItem>
                <SelectItem value="MEDIUM">Moyen</SelectItem>
                <SelectItem value="HARD">Difficile</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Catégorie</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Tags ── */}
      {tags && tags.length > 0 && (
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    isSelected
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Ingrédients ── */}
      <div className="space-y-3">
        <Label>Ingrédients</Label>
        {ingredients.map((ing, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              placeholder="Qté"
              value={ing.quantity}
              onChange={(e) =>
                updateIngredient(index, "quantity", e.target.value)
              }
              className="w-20"
            />
            <Input
              placeholder="Unité"
              value={ing.unit}
              onChange={(e) => updateIngredient(index, "unit", e.target.value)}
              className="w-20"
            />
            <Input
              placeholder="Ingrédient"
              value={ing.name}
              onChange={(e) => updateIngredient(index, "name", e.target.value)}
              className="flex-1"
            />
            {ingredients.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeIngredient(index)}
              >
                <Delete02Icon size={18} />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addIngredient}
        >
          <Add01Icon size={16} className="mr-1" /> Ajouter un ingrédient
        </Button>
      </div>

      {/* ── Étapes ── */}
      <div className="space-y-3">
        <Label>Étapes</Label>
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="mt-2.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-medium">
              {index + 1}
            </span>
            <Textarea
              placeholder={`Étape ${index + 1}...`}
              value={step.instruction}
              onChange={(e) =>
                setSteps(
                  steps.map((s, i) =>
                    i === index ? { ...s, instruction: e.target.value } : s,
                  ),
                )
              }
              rows={2}
              className="flex-1"
            />
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => moveStep(index, "up")}
                disabled={index === 0}
                className="h-7 w-7"
              >
                <ArrowUp01Icon size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => moveStep(index, "down")}
                disabled={index === steps.length - 1}
                className="h-7 w-7"
              >
                <ArrowDown01Icon size={14} />
              </Button>
              {steps.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStep(index)}
                  className="h-7 w-7"
                >
                  <Delete02Icon size={14} />
                </Button>
              )}
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addStep}>
          <Add01Icon size={16} className="mr-1" /> Ajouter une étape
        </Button>
      </div>

      {/* ── Photos ── */}
      <div className="space-y-2">
        <Label>Photos</Label>
        <ImageUpload images={imageUrls} onChange={setImageUrls} />
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-3 pb-8">
        <Button type="submit" disabled={isLoading || !title.trim()}>
          {isLoading
            ? "Enregistrement..."
            : isEditing
              ? "Enregistrer"
              : "Créer la recette"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}