import { OrderStatusEnum } from "../enums/order-status.enum";
import { MakerStatusEnum } from "../enums/maker-status.enum";
import { OrderTypeEnum } from "../enums/order-type.enum";

export interface DevolutionItemDTO {
  id: string;
  name?: string;
  imageUrl?: string;
  quantity: number;
  price: number;
  priceWithFee: number;
  approvedQuantity?: number;
  type: OrderTypeEnum;
}

export interface DevolutionResponseDTO {
  id: string;
  orderId: string;
  orderStatus: OrderStatusEnum;
  reason: string;
  contact: string;
  adminObservation?: string;
  orderTotalValue: number;
  orderSubtotal: number;
  orderPaymentFee: number;
  creationTime: string;
  items: DevolutionItemDTO[];
  images: string[];
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  maker: {
    name: string;
    avatar?: string;
    status: MakerStatusEnum;
  };
}

export interface UpdateDevolutionStatusDTO {
  devolutionId: string;
  status: OrderStatusEnum;
  adminObservation?: string;
  items?: {
    itemToDevolutionId: string;
    quantity: number;
  }[];
}
