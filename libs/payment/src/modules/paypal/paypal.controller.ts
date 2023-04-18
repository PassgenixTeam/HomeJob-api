import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { CaptureOrderDto } from './dto/capture-order.dto';
import { CreatePayoutDto } from './dto/create-payout.dto';

@ApiTags('paypal')
@Controller('paypal')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Get('client-id')
  getClientId() {
    return this.paypalService.getClientId();
  }

  @Get('get-order/:id')
  getOrder(@Param('id') id: string) {
    return this.paypalService.getOrder(id);
  }

  @Get('get-payout/:id')
  getPayout(@Param('id') id: string) {
    return this.paypalService.getPayout(id);
  }

  @Post('capture-order')
  captureOrder(@Body() capturePaypalDto: CaptureOrderDto) {
    return this.paypalService.captureOrder(capturePaypalDto.orderId);
  }

  @Post('create-order')
  createOrder(@Body() createPaypalDto: CreateOrderDto) {
    return this.paypalService.createOrder(createPaypalDto.amount);
  }

  @Post('create-payout')
  createPayout(@Body() createPayoutDto: CreatePayoutDto) {
    return this.paypalService.createPayout(createPayoutDto);
  }
}
