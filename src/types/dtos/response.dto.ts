export interface MetaDTO {
  total: number;
}

export interface ResponseDTO<T> {
  data: T[];
  meta: MetaDTO;
}
