// src/services/api.js
import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api"; // Flask backend URL

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to each request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------- CRUD HELPERS ----------
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
