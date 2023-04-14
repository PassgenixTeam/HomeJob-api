import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { CustomError } from '../base';
import { ERROR } from '../enums/error.enum';

@Catch()
export class AllExceptionsFilter
  extends CustomError
  implements ExceptionFilter
{
  constructor() {
    super(ERROR);
  }

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus ? exception.getStatus() : 500;

    let { errorCode, message } = this.messageCode(exception);

    console.log('exception', exception);

    // temporary treatment
    if (exception?.getResponse()['message']) {
      errorCode = exception.getResponse()['statusCode'];
      message = exception.getResponse()['message'];
    }
    //

    response.status(status).json({
      statusCode: status,
      message,
      errorCode,
      currentTime: new Date().getTime(),
    });
  }
}
