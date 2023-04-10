import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodDto } from './dto/payment-method.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth, AuthUser } from '../../../libs/core/src';
import { UserEntity } from '../user/entities/user.entity';

@ApiTags('payment-method')
@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post()
  @Auth()
  create(@Body() input: PaymentMethodDto, @AuthUser() user: UserEntity) {
    return this.paymentMethodService.create(input, user);
  }

  @Get()
  @Auth()
  findAll(@AuthUser('id') userId: string) {
    return this.paymentMethodService.findAll(userId);
  }

  @Patch('payment-default/:id')
  @Auth()
  setDefault(@Param('id') id: string, @AuthUser('id') userId: string) {
    return this.paymentMethodService.setDefault(id, userId);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @AuthUser('id') userId: string) {
    return this.paymentMethodService.remove(id, userId);
  }
}
