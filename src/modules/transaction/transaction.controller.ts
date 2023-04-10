import { Controller, Get, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Auth, AuthUser } from '../../../libs/core/src';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // @Post()
  // create(@Body() createTransactionDto: CreateTransactionDto) {
  //   return this.transactionService.create(createTransactionDto);
  // }

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
}
