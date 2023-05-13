import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { ERROR, ROLE, removeKeyUndefined } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
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
    return instanceToPlain(user);
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

    return instanceToPlain(userEntity);
  }

  findAll() {
    // return `This action returns all user`;
    throw new Error(ERROR.CanNotCreateUser.toString());
  }

  async userById(id: string) {
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
      .where('user.id = :id', { id: id })
      .getOne();

    return instanceToPlain(userEntity);
  }

  async update(id: string, input: UpdateUserDto) {
    const userInstance = plainToInstance(UserEntity, input);

    delete userInstance.role;
    delete userInstance.password;
    delete userInstance.loginSession;
    delete userInstance.cacheId;
    delete userInstance.email;
    delete userInstance.isActive;
    delete userInstance.stripeCustomerId;

    userInstance.profileCompletion = 90;

    removeKeyUndefined(userInstance);

    const userUpdate = await this.usersRepository.update(id, userInstance);

    if (userUpdate.affected < 1) {
      throw new Error("Can't update user");
    }

    await this.redisService.update(
      userInstance.cacheId,
      JSON.stringify(userInstance),
    );

    return 'Update success';
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async role(role: ROLE, user: UserEntity) {
    if (user.role) {
      return this.me(user);
    }

    await this.usersRepository.update(user.id, { role: role });

    user.role = role;

    await this.redisService.update(user.cacheId, JSON.stringify(user));

    return this.me(user);
  }
}
