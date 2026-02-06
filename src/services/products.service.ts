import apiClient from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import { ProductResponseDTO } from "../types/dtos/product.dto";
import { ResponseDTO } from "../types/dtos/response.dto";

export const productsService = {
  async getProducts() {
    return apiClient.get<ResponseDTO<ProductResponseDTO>>(
      API_ENDPOINTS.ADMIN.PRODUCTS,
    );
  },

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.ADMIN.PRODUCTS}/${id}`);
  },
};
