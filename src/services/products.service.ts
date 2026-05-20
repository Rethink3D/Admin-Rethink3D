import apiClient from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import {
  ProductResponseDTO,
  ProductDetailDTO,
} from "../types/dtos/product.dto";
import { ResponseDTO } from "../types/dtos/response.dto";

export const productsService = {
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    makerId?: string;
  }) {
    return apiClient.get<ResponseDTO<ProductResponseDTO>>(
      API_ENDPOINTS.ADMIN.PRODUCTS,
      { params },
    );
  },

  async getProductById(id: string) {
    return apiClient.get<ProductDetailDTO>(
      `${API_ENDPOINTS.ADMIN.PRODUCTS}/${id}`,
    );
  },

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.ADMIN.PRODUCTS}/${id}`);
  },

  async toggleProductActive(id: string): Promise<void> {
    await apiClient.patch(`${API_ENDPOINTS.ADMIN.PRODUCTS}/${id}/toggle-active`);
  },
};
