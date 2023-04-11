import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CoinService } from './coin.service';
import { CreateCoinDto } from './dto/create-coin.dto';
import { UpdateCoinDto } from './dto/update-coin.dto';
import { CoinPaymentIntentDto } from './dto/coin-payment-intent.dto';
import { Auth, AuthUser } from '../../../libs/core/src';
import { ConfirmPaymentIntentDto } from '@app/payment';

@Controller('coin')
export class CoinController {
  constructor(private readonly coinService: CoinService) {}

  @Post('create-payment-intent')
  @Auth()
  createPaymentIntent(
    @Body() input: CoinPaymentIntentDto,
    @AuthUser('stripeCustomerId') stripeCustomerId: string,
  ) {
    return this.coinService.createPaymentIntent(input, stripeCustomerId);
  }

  @Get()
  @Auth()
  findAll(@AuthUser('id') userId: string) {
    return this.coinService.findAll(userId);
  }

  @Get('coin-list')
  getCoinList() {
    return this.coinService.getCoinList();
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.coinService.findOne(+id);
  }

  @Post('confirm-payment-intent')
  @Auth()
  confirmPaymentIntent(
    @Body() confirmPaymentIntentDto: ConfirmPaymentIntentDto,
    @AuthUser('stripeCustomerId') stripeCustomerId: string,
    @AuthUser('id') userId: string,
    @AuthUser('cacheId') cacheId: string,
  ) {
    return this.coinService.confirmPaymentIntent(
      confirmPaymentIntentDto,
      stripeCustomerId,
      userId,
      cacheId,
    );
  }
}
