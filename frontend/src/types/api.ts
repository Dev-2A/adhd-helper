export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  detail: string;
  status_code: number;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export interface DateRangeParams {
  start_date?: Date;
  end_date?: Date;
}