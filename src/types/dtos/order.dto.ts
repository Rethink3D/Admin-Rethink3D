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
  page?: number;
  limit?: number;
  search?: string;
}

export interface OrderDetailDTO {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      number: string;
      complement: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  maker: {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    state: string;
  };
  productsToOrder: {
    product: {
      id: string;
      name: string;
    };
    quantity: number;
    price: number;
  }[];
  totalValue: number;
  paymentFee: number;
  totalIntermediaryFee: number;
  subtotal: number;
  status: OrderStatusEnum;
  type: string;
  creationTime: string;
  updatedAt: string;
  deadline: string;
}
