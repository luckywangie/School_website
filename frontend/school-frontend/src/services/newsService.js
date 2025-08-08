import api from "./api";

export const getNews = async () => (await api.get("/news")).data;

export const createNews = async (formData) =>
  (await api.post("/news", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })).data;

export const updateNews = async (id, formData) =>
  (await api.put(`/news/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })).data;

export const deleteNews = async (id) =>
  (await api.delete(`/news/${id}`)).data;
