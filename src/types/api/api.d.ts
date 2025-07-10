export interface ApiResponse<T> {
  status: number;
  message: string;
  code: string;
  data: T;
}

export interface ErrorResponse {
  isSuccess: boolean;
  code: string;
  message: string;
}
