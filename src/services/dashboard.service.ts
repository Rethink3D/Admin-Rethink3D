import apiClient from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import { DashboardStatsDTO } from "../types/dtos/dashboard.dto";

export const dashboardService = {
  async getStats(): Promise<DashboardStatsDTO> {
    const response = await apiClient.get<DashboardStatsDTO>(
      API_ENDPOINTS.ADMIN.STATS,
    );
    return response.data;
  },
};
