import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadGatewayException,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Response } from '../interfaces/response.interface';
import { CustomBadRequestException } from '../exception/custom-bad-request.exception';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  private readonly logger = new Logger(TransformInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          data,
          currentTimestamp: new Date().getTime(),
        };
      }),
      catchError((err) => {
        this.logger.error(err.message, err.stack);

        throw new CustomBadRequestException(err.message, err.response);
      }),
    );
  }
}
