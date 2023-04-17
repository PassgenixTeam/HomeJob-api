import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Auth, AuthUser } from '../../../libs/core/src';
import { ApiTags } from '@nestjs/swagger';
import { PaymentIntentDto } from './dto/payment-intent.dto';
import { ConfirmPaymentIntentDto } from '@app/payment';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @Auth()
  findAll(@AuthUser('id') userId: string) {
    return this.transactionService.findAll(userId);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string, @AuthUser('id') userId: string) {
    return this.transactionService.findOne(id, userId);
  }

  @Post('create-payment-intent')
  @Auth()
  createPaymentIntent(
    @Body() input: PaymentIntentDto,
    @AuthUser('id') userId: string,
  ) {
    return this.transactionService.createPaymentIntent(input, userId);
  }

  @Post('confirm-payment-intent')
  @Auth()
  confirmPaymentIntent(
    @Body() input: ConfirmPaymentIntentDto,
    @AuthUser('stripeCustomerId') stripeCustomerId: string,
    @AuthUser('id') userId: string,
    @AuthUser('cacheId') cacheId: string,
  ) {
    return this.transactionService.confirmPaymentIntent(
      input,
      stripeCustomerId,
      userId,
      cacheId,
    );
  }
}
