import { useMutation } from '@tanstack/react-query';
import API from "./api";

// --- Raw API Functions ---
const subAdminLoginAPI = (data) => API.post("/api/sub-admin/login", data);
const subAdminForgotPasswordAPI = (data) => API.post("/api/sub-admin/forgot-password", data);

// --- React Query Hooks ---

export const useSubAdminLogin = () => {
    return useMutation({
        mutationFn: subAdminLoginAPI,
    });
};

export const useSubAdminForgotPassword = () => {
    return useMutation({
        mutationFn: subAdminForgotPasswordAPI,
    });
};
