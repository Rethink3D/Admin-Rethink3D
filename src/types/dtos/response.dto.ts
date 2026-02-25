export interface MetaDTO {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ResponseDTO<T> {
  data: T[];
  meta: MetaDTO;
}
