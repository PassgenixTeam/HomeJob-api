import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { ERROR, ROLE, removeKeyUndefined } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { RoleDto } from './dto/role.dto';
import { RedisService } from '../../../libs/core/src';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly redisService: RedisService,
  ) {}

  async me(user: UserEntity) {
    delete user.loginSession;
    delete user.cacheId;
    return user;
  }

  async profile(user: UserEntity) {
    delete user.loginSession;
    delete user.cacheId;

    const userEntity = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.educations', 'educations')
      .leftJoinAndSelect('user.experiences', 'experiences')
      // .leftJoinAndSelect('user.skills', 'skills')
      .leftJoinAndSelect(
        'user.mappingUserLanguageEntity',
        'mappingUserLanguageEntity',
      )
      .leftJoinAndSelect('user.projects', 'projects')
      // .leftJoinAndSelect('user.socials', 'socials')
      .where('user.id = :id', { id: user.id })
      .getOne();

    return userEntity;
  }

  findAll() {
    // return `This action returns all user`;
    throw new Error(ERROR.CanNotCreateUser.toString());
  }

  update(id: string, input: UpdateUserDto) {
    const user = plainToInstance(UserEntity, input);

    removeKeyUndefined(user);

    return this.usersRepository.update(id, user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async role(role: ROLE, user: UserEntity) {
    if (user.role) {
      delete user.loginSession;
      delete user.cacheId;
      return user;
    }

    await this.usersRepository.update(user.id, { role: role });

    user.role = role;

    await this.redisService.update(user.cacheId, JSON.stringify(user));

    delete user.loginSession;
    delete user.cacheId;

    return user;
  }
}
