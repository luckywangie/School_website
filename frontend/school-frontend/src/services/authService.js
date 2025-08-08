import api from "./api";

export const loginAdmin = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  if (res.data.token) localStorage.setItem("token", res.data.token);
  return res.data;
};

export const logoutAdmin = () => {
  localStorage.removeItem("token");
};
