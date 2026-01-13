import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from "./api";

// --- Raw API Functions ---
const superAdminLoginAPI = (data) => API.post("/api/super-admin/login", data);
const createAdminAPI = (data) => API.post("/api/super-admin/create-admin", data);
const getAllAdminsAPI = () => API.get("/api/super-admin/all-admins");
const deleteAdminAPI = (id) => API.delete(`/api/super-admin/delete/${id}`);
const updateAdminAPI = (id, data) => API.put(`/api/super-admin/update/${id}`, data);
const superAdminForgotPasswordAPI = (data) => API.post("/api/super-admin/forgot-password", data);

// --- React Query Hooks ---

export const useSuperAdminLogin = () => {
    return useMutation({
        mutationFn: superAdminLoginAPI,
    });
};

export const useAdmins = () => {
    return useQuery({
        queryKey: ['admins'],
        queryFn: getAllAdminsAPI,
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreateAdmin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAdminAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(['admins']);
        },
    });
};

export const useUpdateAdmin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateAdminAPI(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['admins']);
        },
    });
};

export const useDeleteAdmin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAdminAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(['admins']);
        },
    });
};

export const useSuperAdminForgotPassword = () => {
    return useMutation({
        mutationFn: superAdminForgotPasswordAPI,
    });
};
