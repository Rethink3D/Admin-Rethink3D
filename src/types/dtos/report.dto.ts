export interface ReportResponseDTO {
  id: string;
  userId: string;
  userName: string;
  makerId: string;
  makerName: string;
  productId: string | null;
  productName: string | null;
  reason: string;
  other: string | null;
  resolved: boolean;
  createdAt: string;
}

export interface ReportFilterDTO {
  page?: number;
  limit?: number;
  makerId?: string;
  productId?: string;
  reason?: string;
  search?: string;
}
