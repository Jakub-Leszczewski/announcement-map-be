import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FindOptionsWhere } from 'typeorm';
import { GetUserResponse, UserSaveResponseData } from '../types';

@Injectable()
export class UserService {
  async getUser(where: FindOptionsWhere<User>): Promise<User> {
    return User.findOne({ where });
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string): Promise<GetUserResponse> {
    if (!id) throw new BadRequestException();

    const user = await this.getUser({ id });
    if (!user) throw new NotFoundException();

    return this.filter(user);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  filter(userEntity: User): UserSaveResponseData {
    const { jwtId, hashPwd, photoFn, ...userResponse } = userEntity;

    return { ...userResponse, avatar: `/user/photo/${userResponse.id}` };
  }
}
