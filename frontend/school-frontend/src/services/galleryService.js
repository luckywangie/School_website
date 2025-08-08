import api from "./api";

export const getGallery = async () => (await api.get("/gallery")).data;

export const uploadGalleryImage = async (formData) =>
  (await api.post("/gallery", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })).data;

export const deleteGalleryImage = async (id) =>
  (await api.delete(`/gallery/${id}`)).data;
