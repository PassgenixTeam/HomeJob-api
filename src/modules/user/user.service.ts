import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { ERROR, removeKeyUndefined } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
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
}
