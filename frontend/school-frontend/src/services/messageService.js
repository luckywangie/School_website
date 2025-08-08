import api from "./api";

export const getMessages = async () => (await api.get("/messages")).data;
