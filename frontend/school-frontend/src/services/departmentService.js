import api from "./api";

// Departments
export const getDepartments = async () => (await api.get("/academics/departments")).data;

export const createDepartment = async (formData) =>
  (await api.post("/academics/departments", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })).data;

export const updateDepartment = async (id, formData) =>
  (await api.put(`/academics/departments/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })).data;

export const deleteDepartment = async (id) =>
  (await api.delete(`/academics/departments/${id}`)).data;

// Staff
export const createStaff = async (formData) =>
  (await api.post("/academics/staff", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })).data;

export const updateStaff = async (id, formData) =>
  (await api.put(`/academics/staff/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })).data;

export const deleteStaff = async (id) =>
  (await api.delete(`/academics/staff/${id}`)).data;
