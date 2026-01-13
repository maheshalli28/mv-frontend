// utils/auth.js
export const getCurrentUser = () => JSON.parse(localStorage.getItem("user"));

export const isAdmin = () => {
    const role = getCurrentUser()?.role;
    return role === "super-admin" || role === "sub-admin";
};

export const isSuperAdmin = () => getCurrentUser()?.role === "super-admin";

export const isCustomer = () => getCurrentUser()?.role === "customer";

export const getToken = () => localStorage.getItem("token") || getCurrentUser()?.token;

export const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
};
