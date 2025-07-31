import { productData } from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  async getAll() {
    await delay(300);
    return [...productData];
  },

  async getById(id) {
    await delay(200);
    const product = productData.find(p => p.Id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  },

  async getByCategory(categoryId) {
    await delay(250);
    return productData.filter(p => p.categoryId === categoryId).map(p => ({ ...p }));
  },

  async searchProducts(query) {
    await delay(400);
    const searchTerm = query.toLowerCase();
    return productData.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    ).map(p => ({ ...p }));
  },

  async getFeatured() {
    await delay(200);
    return productData.filter(p => p.rating >= 4.5).slice(0, 8).map(p => ({ ...p }));
  },

  async getDeals() {
    await delay(200);
    return productData.filter(p => p.salePrice).map(p => ({ ...p }));
  }
};