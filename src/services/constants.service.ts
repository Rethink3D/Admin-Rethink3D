import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import { ConstantNameEnum } from "../types/enums/constant-name.enum";

export const constantsService = {
  getConstantsBatch: async (names: ConstantNameEnum[]) => {
    const query = names.join(",");
    return api.get<Record<string, string | number>>(
      `${API_ENDPOINTS.CONSTANTS}/batch?names=${query}`,
    );
  },

  updateConstant: async (name: ConstantNameEnum, value: string | number) => {
    return api.patch(`${API_ENDPOINTS.CONSTANTS}/${name}`, { value });
  },
};
