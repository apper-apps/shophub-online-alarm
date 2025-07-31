import { orderData } from "@/services/mockData/orders.json";
import { generateOrderNumber } from "@/utils/formatters";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let orders = [...orderData];

export const orderService = {
  async getAll() {
    await delay(300);
    return [...orders];
  },

  async getById(id) {
    await delay(200);
    const order = orders.find(o => o.Id === id);
    if (!order) {
      throw new Error("Order not found");
    }
    return { ...order };
  },

  async create(orderData) {
    await delay(500);
    
    const newOrder = {
      Id: Math.max(...orders.map(o => o.Id), 0) + 1,
      orderNumber: generateOrderNumber(),
      ...orderData,
      status: "Processing",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.push(newOrder);
    return { ...newOrder };
  },

  async updateStatus(id, status) {
    await delay(200);
    
    const orderIndex = orders.findIndex(o => o.Id === id);
    if (orderIndex === -1) {
      throw new Error("Order not found");
    }

    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      updatedAt: new Date().toISOString()
    };

    return { ...orders[orderIndex] };
  }
};