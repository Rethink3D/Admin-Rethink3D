import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import { FeedbackResponseDto } from "../types/dtos/feedback.dto";

export const feedbackService = {
  getFeedbacks: async () => {
    return api.get<FeedbackResponseDto[]>(API_ENDPOINTS.ADMIN.FEEDBACKS);
  },

  markAsSeen: async (id: string) => {
    return api.patch(`${API_ENDPOINTS.ADMIN.FEEDBACKS}/${id}/seen`);
  },

  markAsUnseen: async (id: string) => {
    return api.patch(`${API_ENDPOINTS.ADMIN.FEEDBACKS}/${id}/unseen`);
  },
};
