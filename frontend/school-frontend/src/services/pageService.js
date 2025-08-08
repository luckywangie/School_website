import api from "./api";

export const getPages = async () => (await api.get("/pages")).data;

export const updatePage = async (id, content) =>
  (await api.put(`/pages/${id}`, { content })).data;
