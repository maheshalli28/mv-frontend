// utils/auth.js
export const getCurrentUser = () => JSON.parse(localStorage.getItem("user"));

export const isAdmin = () => getCurrentUser()?.role === "admin";

export const isCustomer = () => getCurrentUser()?.role === "customer";

export const getToken = () => getCurrentUser()?.token;

export const logout = () => localStorage.removeItem("user");
