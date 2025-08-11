// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Use localhost consistently

const api = axios.create({
  baseURL: API_URL,
});

// Add Authorization token and set Content-Type only when needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Sending token:", token); // Debug token presence
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Only set Content-Type for non-FormData requests to avoid conflicts
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

export const getItems = async (endpoint) => {
  const res = await api.get(`/${endpoint}`);
  return res.data;
};

export const getItem = async (endpoint, id) => {
  const res = await api.get(`/${endpoint}/${id}`);
  return res.data;
};

export const createItem = async (endpoint, data) => {
  const res = await api.post(`/${endpoint}`, data);
  return res.data;
};

export const updateItem = async (endpoint, id, data) => {
  const res = await api.put(`/${endpoint}/${id}`, data);
  return res.data;
};

export const deleteItem = async (endpoint, id) => {
  const res = await api.delete(`/${endpoint}/${id}`);
  return res.data;
};

export default api;
