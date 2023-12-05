import { HttpException, HttpStatus } from '@nestjs/common';

interface CodeCompilationOptions {
  cause?: string;
  description?: string;
}
export class CodeCompilationException extends HttpException {
  constructor(message: string, options?: CodeCompilationOptions) {
    const status = HttpStatus.BAD_REQUEST;
    super({ message, ...options, status }, status);
  }
}
