import { reviewData } from "@/services/mockData/reviews.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const reviewService = {
  async getAll() {
    await delay(200);
    return [...reviewData];
  },

  async getById(id) {
    await delay(150);
    const review = reviewData.find(r => r.Id === id);
    if (!review) {
      throw new Error("Review not found");
    }
    return { ...review };
  },

  async getByProductId(productId) {
    await delay(250);
    return reviewData.filter(r => r.productId === productId).map(r => ({ ...r }));
  },

  async create(reviewData) {
    await delay(300);
    
    const newReview = {
      Id: Math.max(...reviewData.map(r => r.Id), 0) + 1,
      ...reviewData,
      date: new Date().toISOString()
    };

    reviewData.push(newReview);
    return { ...newReview };
  }
};