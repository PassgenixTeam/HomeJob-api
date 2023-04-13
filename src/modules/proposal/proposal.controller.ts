import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { Auth, AuthUser } from '../../../libs/core/src';
import { UserEntity } from '../user/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('proposal')
@Controller('proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Post()
  @Auth()
  create(@Body() input: CreateProposalDto, @AuthUser() user: UserEntity) {
    return this.proposalService.create(input, user);
  }

  @Get()
  @Auth()
  findAll(@AuthUser('id') userId: string) {
    return this.proposalService.findAll(userId);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.proposalService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() updateProposalDto: UpdateProposalDto,
    @AuthUser() user: UserEntity,
  ) {
    return this.proposalService.update(id, updateProposalDto, user);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @AuthUser('id') userId: string) {
    return this.proposalService.remove(id, userId);
  }
}
