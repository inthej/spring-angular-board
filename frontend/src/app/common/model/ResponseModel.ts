export interface ResponseModel<T> {
  success: boolean;
  data: T;
  error: ErrorModel;
}

export interface ErrorModel {
  code: string;
  message: string;
  data: ErrorData;
}

interface ErrorData {
  exceptionMessage: string;
  stackTrace: string;
}
