import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";

export interface RetryMakerPaymentsResponse {
  processed: number;
}

export const paymentsService = {
  retryMakerPayments: async () => {
    return api.post<RetryMakerPaymentsResponse>(
      API_ENDPOINTS.ADMIN.MAKER_PAYMENTS_RETRY,
    );
  },
};
