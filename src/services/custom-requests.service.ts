import apiClient from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import {
  CustomRequestResponseDTO,
  CustomRequestFilterDTO,
  CustomRequestDetailDTO,
} from "../types/dtos/custom-request.dto";
import { ResponseDTO } from "../types/dtos/response.dto";

export const customRequestsService = {
  async getCustomRequests(
    filter?: CustomRequestFilterDTO,
  ): Promise<ResponseDTO<CustomRequestResponseDTO>> {
    const response = await apiClient.get<ResponseDTO<CustomRequestResponseDTO>>(
      API_ENDPOINTS.ADMIN.CUSTOM_REQUESTS,
      { params: filter },
    );
    return response.data;
  },
  async getCustomRequestById(id: string): Promise<CustomRequestDetailDTO> {
    const response = await apiClient.get<CustomRequestDetailDTO>(
      `${API_ENDPOINTS.ADMIN.CUSTOM_REQUESTS}/${id}`,
    );
    return response.data;
  },
};
