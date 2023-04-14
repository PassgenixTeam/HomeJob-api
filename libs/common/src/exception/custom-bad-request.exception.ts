import { BadRequestException, HttpStatus } from '@nestjs/common';

export class CustomBadRequestException extends BadRequestException {
  constructor(message: string, response: any) {
    super({
      message,
      statusCode: HttpStatus.BAD_REQUEST,
      ...response,
    });
  }
}
