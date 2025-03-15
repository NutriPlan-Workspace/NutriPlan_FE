export interface ApiResponse<T = unknown> {
  success: boolean;
  data: {
    message: string;
    code: number;
    success: boolean;
    data: T;
  };
}
