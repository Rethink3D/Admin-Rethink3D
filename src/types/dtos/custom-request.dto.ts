import { CustomRequestStatusEnum } from "../enums/custom-request-status.enum";
import { ServiceTypeEnum } from "../enums/service-type.enum";
import { MaterialTypeEnum } from "../enums/material-type.enum";

export interface CustomRequestResponseDTO {
  id: string;
  title: string;
  status: CustomRequestStatusEnum;
  user: {
    id: string;
    name: string;
    email: string;
  };
  maker?: {
    id: string;
    name: string;
  };
  creationTime: string;
  service: ServiceTypeEnum;
}

export interface CustomRequestDetailDTO extends CustomRequestResponseDTO {
  description: string;
  quantity: number;
  categories: {
    id: number;
    name: string;
  }[];
  materials?: MaterialTypeEnum[];
  projectLink?: string;
  projectFiles?: string[];
  images: {
    id: string;
    url: string;
  }[];
}

export interface CustomRequestFilterDTO {
  page?: number;
  limit?: number;
  search?: string;
  status?: CustomRequestStatusEnum;
}
