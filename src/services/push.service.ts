import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";

export enum PushTargetEnum {
  ALL = "ALL",
  MAKERS = "MAKERS",
  CLIENTS = "CLIENTS",
  SELECTED = "SELECTED",
}

export interface SendPushAdminDTO {
  target: PushTargetEnum;
  userIds?: string[];
  title: string;
  message: string;
}

export const pushService = {
  sendPushNotification: async (data: SendPushAdminDTO) => {
    return api.post(API_ENDPOINTS.ADMIN.PUSH, data);
  },
};
