import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import {
  MakerPreviewDTO,
  MakerDetailDTO,
  AdminUpdateMakerDTO,
} from "../types/dtos/maker.dto";
import { ResponseDTO } from "../types/dtos/response.dto";

export const makersService = {
  getMakers: async () => {
    return api.get<ResponseDTO<MakerPreviewDTO>>(API_ENDPOINTS.ADMIN.MAKERS);
  },

  getMakerById: async (id: string) => {
    return api.get<MakerDetailDTO>(`${API_ENDPOINTS.ADMIN.MAKERS}/${id}`);
  },

  updateMaker: async (id: string, data: AdminUpdateMakerDTO) => {
    return api.patch<MakerDetailDTO>(
      `${API_ENDPOINTS.ADMIN.MAKERS}/${id}`,
      data,
    );
  },
};
