const STORAGE_KEY = "bakersMateSavedRecipes";

export function getSavedRecipes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveRecipe(recipe) {
  const recipes = getSavedRecipes();
  const recipeToSave = {
    ...recipe,
    id: `recipe_${Date.now()}`,
    createdAt: Date.now(),
  };

  recipes.push(recipeToSave);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  return recipeToSave;
}

export function deleteRecipe(recipeId) {
  const recipes = getSavedRecipes().filter(
    (recipe) => recipe.id !== recipeId,
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}