import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
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
  findAll() {
    return this.paymentMethodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentMethodService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentMethodService.remove(+id);
  }
}
