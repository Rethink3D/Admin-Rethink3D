import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";

export interface CategoryDto {
  id: number;
  name: string;
}

export const categoriesService = {
  getCategories: async () => {
    return api.get<CategoryDto[]>(API_ENDPOINTS.ADMIN.CATEGORIES);
  },

  createCategory: async (name: string) => {
    return api.post(API_ENDPOINTS.ADMIN.CATEGORIES, { name });
  },

  getImpact: async (id: number) => {
    return api.get<{
      productCount: number;
      products: string[];
      makerCount: number;
      makers: string[];
      requestCount: number;
      requests: string[];
    }>(`${API_ENDPOINTS.ADMIN.CATEGORIES}/${id}/impact`);
  },

  deleteCategory: async (id: number) => {
    return api.delete(`${API_ENDPOINTS.ADMIN.CATEGORIES}/${id}`);
  },
};
