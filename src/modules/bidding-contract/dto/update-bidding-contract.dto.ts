import { PartialType } from '@nestjs/swagger';
import { CreateBiddingContractDto } from './create-bidding-contract.dto';

export class UpdateBiddingContractDto extends PartialType(
  CreateBiddingContractDto,
) {}
