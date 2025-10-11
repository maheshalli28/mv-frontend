import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from "./api";

// --- Raw API Functions ---
const getAllCustomersAPI = (page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc') =>
  API.get(`/api/customers/all?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);

const searchCustomersAPI = (q) => API.get(`/api/customers/search`, { params: { q } });

const filterCustomersAPI = (params) => API.get(`/api/customers/filter`, { params });

const updateCustomerAPI = (id, data) => API.put(`/api/customers/update/${id}`, data);

const registerCustomerAPI = (data) => API.post(`/api/customers/register`, data);

const deleteCustomerAPI = (id) => API.delete(`/api/customers/delete/${id}`);

const getCustomerStatsAPI = () => API.get(`/api/customers/stats`);

// --- React Query Hooks ---

// 1️⃣ Fetch all customers initially with pagination & sorting
export const useCustomers = (page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc') => {
  return useQuery({
    queryKey: ['customers', page, limit, sortBy, sortOrder],
    queryFn: () => getAllCustomersAPI(page, limit, sortBy, sortOrder),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000,
  });
};

// 2️⃣ Search customers (enabled when query > 2 chars)
export const useSearchCustomers = (query) => {
  return useQuery({
    queryKey: ['customers', 'search', query],
    queryFn: () => searchCustomersAPI(query),
    enabled: !!query && query.length > 2,
    staleTime: 1 * 60 * 1000,
  });
};

// 3️⃣ Filter customers (enabled only when user applies filters)
export const useFilterCustomers = (filters) => {
  return useQuery({
    queryKey: ['customers', 'filter', filters],
    queryFn: () => filterCustomersAPI(filters),
    enabled: Object.values(filters).some(v => v !== ''), // Only fetch when any filter applied
    staleTime: 2 * 60 * 1000,
  });
};

// 4️⃣ Customer statistics
export const useCustomerStats = () => {
  return useQuery({
    queryKey: ['customerStats'],
    queryFn: getCustomerStatsAPI,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
};

// --- Mutations ---
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateCustomerAPI(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['customers']);
      queryClient.invalidateQueries(['customerStats']);
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomerAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      queryClient.invalidateQueries(['customerStats']);
    },
  });
};

export const useRegisterCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerCustomerAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['customerStats']);
      queryClient.invalidateQueries(['customers']);
    },
  });
};


// --- Legacy API Functions (for backward compatibility) ---
export const getAllCustomers = () => API.get(`/api/customers/all`);
export const searchCustomers = (q) => API.get(`/api/customers/search`, { params: { q } });
export const filterCustomers = (params) => API.get(`/api/customers/filter`, { params });
export const getCustomerProfileById = (id) => API.get(`/api/customers/${id}`);
export const updateCustomer = (id, data) => API.put(`/api/customers/update/${id}`, data);
export const getCustomerProfile = (email, phone) =>
  API.get(`/api/customers/profile`, { params: { email, phone } });
export const registerCustomer = (data) => API.post(`/api/customers/register`, data);
export const deleteCustomer = (id) => API.delete(`/api/customers/delete/${id}`);
export const getCustomerStats = () => API.get(`/api/customers/stats`);
