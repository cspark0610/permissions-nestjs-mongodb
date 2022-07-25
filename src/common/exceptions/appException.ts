import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor({
    error,
    errorCode,
    statusCode,
    extra = {},
  }: {
    error: string;
    errorCode: string;
    statusCode: HttpStatus;
    extra?: Record<string, any>;
  }) {
    super({ extra, error, errorCode }, statusCode);
  }
}
