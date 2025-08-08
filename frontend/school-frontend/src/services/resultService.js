import api from "./api";

export const getResults = async () => (await api.get("/results")).data;

export const uploadResult = async (formData) =>
  (await api.post("/results", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })).data;

export const deleteResult = async (id) =>
  (await api.delete(`/results/${id}`)).data;
