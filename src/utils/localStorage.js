const CART_KEY = "shophub_cart";
const RECENTLY_VIEWED_KEY = "shophub_recently_viewed";
const SHIPPING_ADDRESS_KEY = "shophub_shipping_address";

export const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error reading cart from localStorage:", error);
    return [];
  }
};

export const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

export const getRecentlyViewedFromStorage = () => {
  try {
    const items = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error("Error reading recently viewed from localStorage:", error);
    return [];
  }
};

export const saveRecentlyViewedToStorage = (items) => {
  try {
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving recently viewed to localStorage:", error);
  }
};

export const getShippingAddressFromStorage = () => {
  try {
    const address = localStorage.getItem(SHIPPING_ADDRESS_KEY);
    return address ? JSON.parse(address) : null;
  } catch (error) {
    console.error("Error reading shipping address from localStorage:", error);
    return null;
  }
};

export const saveShippingAddressToStorage = (address) => {
  try {
    localStorage.setItem(SHIPPING_ADDRESS_KEY, JSON.stringify(address));
  } catch (error) {
    console.error("Error saving shipping address to localStorage:", error);
  }
};

export const clearStorage = () => {
  try {
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
    localStorage.removeItem(SHIPPING_ADDRESS_KEY);
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};