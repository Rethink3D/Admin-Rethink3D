export interface ChatMessagePreviewDTO {
  id: string;
  text: string;
  type: string;
  senderUid: string;
  senderRole: "CLIENT" | "MAKER";
  time: string | null;
}

export interface ReportResponseDTO {
  id: string;
  userId: string;
  userName: string;
  userEmail: string | null;
  userPhone: string | null;
  makerId: string;
  makerName: string;
  productId: string | null;
  productName: string | null;
  chatId: string | null;
  reason: string;
  other: string | null;
  resolved: boolean;
  createdAt: string;
  chatMessages: ChatMessagePreviewDTO[] | null;
}

export interface ReportFilterDTO {
  page?: number;
  limit?: number;
  makerId?: string;
  productId?: string;
  reason?: string;
  search?: string;
}
