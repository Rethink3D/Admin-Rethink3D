import apiClient from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import {
  OrderResponseDTO,
  OrderFilterDTO,
  OrderDetailDTO,
} from "../types/dtos/order.dto";
import { ResponseDTO } from "../types/dtos/response.dto";

export const ordersService = {
  async getOrders(
    filter?: OrderFilterDTO,
  ): Promise<ResponseDTO<OrderResponseDTO>> {
    const response = await apiClient.get<ResponseDTO<OrderResponseDTO>>(
      API_ENDPOINTS.ADMIN.ORDERS,
      { params: filter },
    );
    return response.data;
  },
  async getOrderById(id: string): Promise<OrderDetailDTO> {
    const response = await apiClient.get<OrderDetailDTO>(
      `${API_ENDPOINTS.ADMIN.ORDERS}/${id}`,
    );
    return response.data;
  },
};
