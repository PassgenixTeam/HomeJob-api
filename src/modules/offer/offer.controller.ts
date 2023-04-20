import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth, AuthUser } from '../../../libs/core/src';

@ApiTags('Offer')
@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post()
  @Auth()
  create(
    @Body() input: CreateOfferDto,
    @AuthUser('stripeCustomerId') userId: string,
  ) {
    return this.offerService.create(input, userId);
  }

  @Get('accept/:id')
  @Auth()
  acceptOffer(@Param('id') id: string, @AuthUser('id') userId: string) {
    return this.offerService.acceptOffer(id, userId);
  }

  @Get('reject/:id')
  @Auth()
  rejectOffer(@Param('id') id: string, @AuthUser('id') userId: string) {
    return this.offerService.rejectOffer(id, userId);
  }

  @Get()
  @Auth()
  findAll(@AuthUser('id') userId: string) {
    return this.offerService.findAll(userId);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string, @AuthUser('id') userId: string) {
    return this.offerService.findOne(id, userId);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() input: UpdateOfferDto,
    @AuthUser('id') userId: string,
  ) {
    return this.offerService.update(id, input, userId);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @AuthUser('id') userId: string) {
    return this.offerService.remove(id, userId);
  }
}
