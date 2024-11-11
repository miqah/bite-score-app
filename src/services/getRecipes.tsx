export const getRecipes = async () => {
  const response = await fetch("/api/recipes");
  return response.json();
};

export const getRecipeById = async (id: string) => {
  const response = await fetch(`/api/recipes/${id}`);
  return response.json();
};
