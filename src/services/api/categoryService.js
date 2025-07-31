import { categoryData } from "@/services/mockData/categories.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const categoryService = {
  async getAll() {
    await delay(200);
    return [...categoryData];
  },

  async getById(id) {
    await delay(150);
    const category = categoryData.find(c => c.Id === id);
    if (!category) {
      throw new Error("Category not found");
    }
    return { ...category };
  },

  async getMainCategories() {
    await delay(200);
    return categoryData.filter(c => !c.parentId).map(c => ({ ...c }));
  },

  async getSubCategories(parentId) {
    await delay(150);
    return categoryData.filter(c => c.parentId === parentId).map(c => ({ ...c }));
  }
};