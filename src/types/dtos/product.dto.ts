export interface ProductResponseDTO {
  id: string;
  name: string;
  price: number;
  makerName: string;
  isActive: boolean;
}

export interface ProductDetailDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  priceWithFee: number;
  isActive: boolean;
  makerName: string;
  makerId: string;
  categories: { id: string; name: string }[];
  images: { id: string; url: string }[];
  materials: string[];
  productionDays: number;
  averageRating: number;
  ratingCount: number;
  productDimensions: {
    weight: number;
    length: number;
    width: number;
    height: number;
  };
}
