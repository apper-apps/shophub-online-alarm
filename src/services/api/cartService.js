import { getCartFromStorage, saveCartToStorage } from "@/utils/localStorage";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const cartService = {
  async getItems() {
    await delay(100);
    return getCartFromStorage();
  },

  async addItem(item) {
    await delay(200);
    const currentCart = getCartFromStorage();
    
    // Check if item already exists
    const existingItemIndex = currentCart.findIndex(
      cartItem => cartItem.productId === item.productId && cartItem.variantId === item.variantId
    );

    let updatedCart;
    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      updatedCart = currentCart.map((cartItem, index) => 
        index === existingItemIndex 
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      );
    } else {
      // Add new item
      updatedCart = [...currentCart, item];
    }

    saveCartToStorage(updatedCart);
    return updatedCart;
  },

  async updateItem(productId, variantId, quantity) {
    await delay(150);
    const currentCart = getCartFromStorage();
    
    const updatedCart = currentCart.map(item => 
      item.productId === productId && item.variantId === variantId
        ? { ...item, quantity }
        : item
    );

    saveCartToStorage(updatedCart);
    return updatedCart;
  },

  async removeItem(productId, variantId) {
    await delay(150);
    const currentCart = getCartFromStorage();
    
    const updatedCart = currentCart.filter(
      item => !(item.productId === productId && item.variantId === variantId)
    );

    saveCartToStorage(updatedCart);
    return updatedCart;
  },

  async clearCart() {
    await delay(100);
    saveCartToStorage([]);
    return [];
  },

  async getItemCount() {
    await delay(50);
    const cart = getCartFromStorage();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
};