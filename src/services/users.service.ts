import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import { ResponseDTO } from "../types/dtos/response.dto";

export interface UserResponseDTO {
  id: string;
  name: string;
  lastName: string;
  email: string;
  isMaker: boolean;
}

export const usersService = {
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    hasDevices?: boolean;
  }) => {
    return api.get<ResponseDTO<UserResponseDTO>>(API_ENDPOINTS.ADMIN.USERS, {
      params,
    });
  },
};
