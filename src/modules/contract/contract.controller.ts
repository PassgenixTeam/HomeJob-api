import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ContractPaymentIntentDto } from './dto/contract-payment-intent.dto';
import { Auth, AuthUser } from '@app/core';
import { ConfirmPaymentIntentDto } from '../../../libs/payment/src';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Contract')
@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  @Auth()
  create(@Body() input: CreateContractDto, @AuthUser('id') userId: string) {
    return this.contractService.create(input, userId);
  }

  @Post('create-payment-intent')
  @Auth()
  createPaymentIntent(
    @Body() input: ContractPaymentIntentDto,
    @AuthUser('stripeCustomerId') stripeCustomerId: string,
    @AuthUser('id') userId: string,
  ) {
    return this.contractService.createPaymentIntent(
      input,
      stripeCustomerId,
      userId,
    );
  }

  @Post('confirm-payment-intent')
  @Auth()
  confirmPaymentIntent(
    @Body() input: ConfirmPaymentIntentDto,
    @AuthUser('stripeCustomerId') stripeCustomerId: string,
    @AuthUser('id') userId: string,
    @AuthUser('cacheId') cacheId: string,
  ) {
    return this.contractService.confirmPaymentIntent(
      input,
      stripeCustomerId,
      userId,
      cacheId,
    );
  }

  @Get()
  @Auth()
  findAll(@AuthUser('id') userId: string) {
    return this.contractService.findAll(userId);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string, @AuthUser('id') userId: string) {
    return this.contractService.findOne(id, userId);
  }

  @Patch(':id')
  // @Auth()
  update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
    @AuthUser('id') userId: string,
  ) {
    return this.contractService.update(id, updateContractDto, userId);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @AuthUser('id') userId: string) {
    return this.contractService.remove(id, userId);
  }
}
