import api from "./api";

export const getTenders = async () => (await api.get("/tenders")).data;

export const createTender = async (formData) =>
  (await api.post("/tenders", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })).data;

export const deleteTender = async (id) =>
  (await api.delete(`/tenders/${id}`)).data;
