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

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  create(@Body() createContractDto: CreateContractDto) {
    return this.contractService.create(createContractDto);
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
  findAll() {
    return this.contractService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractService.update(+id, updateContractDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contractService.remove(+id);
  }
}
