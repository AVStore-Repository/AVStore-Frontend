import { BASE_URL } from "../config/config";


const API_BASE_URL = BASE_URL;

export const api = {
  // Auth endpoints
  login: (idToken) => 
    fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      },
      body: JSON.stringify({ idToken }),
    }),

  register: (userData) =>
    fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    }),

  getProfile: (token) =>
    fetch(`${API_BASE_URL}/auth/profile`, {
      headers: { "Authorization": `Bearer ${token}` },
    }),

    // Product endpoints
  getProducts: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return fetch(`${API_BASE_URL}/products?${params}`);
  },

  getProduct: (id) => fetch(`${API_BASE_URL}/products/${id}`),

  // Cart endpoints
  getCart: (userId, token) =>
    fetch(`${API_BASE_URL}/cart?userId=${userId}`, {
      headers: { "Authorization": `Bearer ${token}` },
    }),

  updateCart: (cartData, token) =>
    fetch(`${API_BASE_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(cartData),
    }),

  // Order endpoints
  createOrder: (orderData, token) =>
    fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    }),

  getOrders: (email, token) =>
    fetch(`${API_BASE_URL}/orders/user/${email}`, {
      headers: { "Authorization": `Bearer ${token}` },
    }),
      // Contact endpoints
  submitContact: (contactData) =>
    fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData),
    }),

  getContacts: (token) =>
    fetch(`${API_BASE_URL}/contact`, {
      headers: { "Authorization": `Bearer ${token}` },
    }),

  getContact: (id, token) =>
    fetch(`${API_BASE_URL}/contact/${id}`, {
      headers: { "Authorization": `Bearer ${token}` },
    }),

  markContactAsRead: (id, token) =>
    fetch(`${API_BASE_URL}/contact/${id}/read`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` },
    }),

  markContactAsResponded: (id, token) =>
    fetch(`${API_BASE_URL}/contact/${id}/responded`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` },
    }),

  deleteContact: (id, token) =>
    fetch(`${API_BASE_URL}/contact/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    }),
};  

// Helper function to handle API responses
export const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "API request failed");
  }
  return response.json();
};
