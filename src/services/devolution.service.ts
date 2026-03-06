import apiClient from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import {
  DevolutionResponseDTO,
  UpdateDevolutionStatusDTO,
} from "../types/dtos/devolution.dto";

export const devolutionService = {
  async getDevolutions(): Promise<DevolutionResponseDTO[]> {
    const response = await apiClient.get<DevolutionResponseDTO[]>(
      API_ENDPOINTS.ADMIN.DEVOLUTIONS,
    );
    return response.data;
  },

  async updateDevolutionStatus(data: UpdateDevolutionStatusDTO): Promise<void> {
    await apiClient.patch(API_ENDPOINTS.ADMIN.DEVOLUTIONS, data);
  },
};
