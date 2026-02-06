import apiClient from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import { OrderResponseDTO, OrderFilterDTO } from "../types/dtos/order.dto";
import { ResponseDTO } from "../types/dtos/response.dto";

export const ordersService = {
  async getOrders(
    filter?: OrderFilterDTO,
  ): Promise<ResponseDTO<OrderResponseDTO>> {
    const params = filter?.status ? { status: filter.status } : {};
    const response = await apiClient.get<ResponseDTO<OrderResponseDTO>>(
      API_ENDPOINTS.ADMIN.ORDERS,
      { params },
    );
    return response.data;
  },
};
