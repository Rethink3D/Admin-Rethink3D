import { MakerStatusEnum } from "../enums/maker-status.enum";
import { ServiceTypeEnum } from "../enums/service-type.enum";

export interface MakerPreviewDTO {
  id: string;
  name: string;
  service: ServiceTypeEnum;
  status: MakerStatusEnum;
  productsCount: number;
  ordersCount: number;
  imageUrl: string;
  creationTime: Date;
  city?: string;
  state?: string;
}

export interface MakerDetailDTO {
  id: string;
  name: string;
  description: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  service: ServiceTypeEnum;
  status: MakerStatusEnum;
  productsCount: number;
  ordersCount: number;
  imageUrl: string;
  city?: string;
  state?: string;
  creationTime: Date;
  deletedAt?: Date;
}

export interface AdminUpdateMakerDTO {
  status?: MakerStatusEnum;
  name?: string;
  description?: string;
  service?: ServiceTypeEnum;
}
