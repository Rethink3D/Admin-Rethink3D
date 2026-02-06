import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import { SendEmailDTO } from "../types/dtos/email.dto";

export const emailService = {
  sendEmail: async (data: SendEmailDTO) => {
    return api.post<void>(API_ENDPOINTS.ADMIN.EMAIL, data);
  },
};
