import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const status = exception.getStatus();
    const response = (exception.getResponse?.() as any) ?? {};
    res.status(status).json({
      statusCode: status,
      message: response.message || exception.message,
      error: response.error,
      timestamp: new Date().toISOString(),
    });
  }
}