import { OrderStatusEnum } from "../enums/order-status.enum";

export interface OrderResponseDTO {
  id: string;
  customerName: string;
  makerName: string;
  totalValue: number;
  status: OrderStatusEnum;
  createdAt: Date;
}

export interface OrderFilterDTO {
  status?: OrderStatusEnum;
}
