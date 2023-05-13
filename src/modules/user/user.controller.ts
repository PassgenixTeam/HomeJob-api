import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth, AuthUser } from '@app/core';
import { RoleDto } from './dto/role.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Patch('role')
  @Auth()
  role(@Body() input: RoleDto, @AuthUser() user: any) {
    return this.userService.role(input.role, user);
  }

  @Auth()
  @Get('me')
  me(@AuthUser() user: any) {
    return this.userService.me(user);
  }

  @Auth()
  @Get('profile')
  profile(@AuthUser() user: any) {
    return this.userService.profile(user);
  }

  @Auth()
  @Get(':id')
  userById(@Param('id') userId: string) {
    return this.userService.userById(userId);
  }

  @Patch('profile')
  @Auth()
  update(@Body() updateUserDto: UpdateUserDto, @AuthUser('id') userId: string) {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
