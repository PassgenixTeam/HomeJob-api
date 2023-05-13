import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { BiddingContractService } from './bidding-contract.service';
import { CreateBiddingContractDto } from './dto/create-bidding-contract.dto';
import { Auth, AuthUser } from '@app/core';
import { ApiTags } from '@nestjs/swagger';
import { AcceptBiddingContractDto } from 'src/modules/bidding-contract/dto/accept-contract.dto';

@ApiTags('Bidding contract')
@Controller('bidding-contract')
export class BiddingContractController {
  constructor(
    private readonly biddingContractService: BiddingContractService,
  ) {}

  @Post()
  @Auth()
  create(
    @Body() createBiddingContractDto: CreateBiddingContractDto,
    @AuthUser('id') userId: string,
  ) {
    return this.biddingContractService.create(createBiddingContractDto, userId);
  }

  @Patch('accept/:id')
  @Auth()
  acceptContract(
    @Body() acceptContractDto: AcceptBiddingContractDto,
    @Param('id') id: string,
    @AuthUser('id') userId: string,
  ) {
    return this.biddingContractService.acceptContract(
      id,
      userId,
      acceptContractDto,
    );
  }

  @Get()
  @Auth()
  findAll(@AuthUser('id') userId: string) {
    return this.biddingContractService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.biddingContractService.findOne(id);
  }
}
