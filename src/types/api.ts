export interface ApiResponse<T> {
  data: T;
  message: string;
  code: number;
  status: number;
}
