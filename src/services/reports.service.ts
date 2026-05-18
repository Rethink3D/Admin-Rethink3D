import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import { ReportResponseDTO, ReportFilterDTO } from "../types/dtos/report.dto";
import { ResponseDTO } from "../types/dtos/response.dto";

export const reportsService = {
  getReports: async (filters?: ReportFilterDTO) => {
    return api.get<ResponseDTO<ReportResponseDTO>>(API_ENDPOINTS.ADMIN.REPORTS, {
      params: filters,
    });
  },

  resolveReport: async (id: string) => {
    return api.patch(`${API_ENDPOINTS.ADMIN.REPORTS}/${id}/resolve`);
  },

  unresolveReport: async (id: string) => {
    return api.patch(`${API_ENDPOINTS.ADMIN.REPORTS}/${id}/unresolve`);
  },
};
