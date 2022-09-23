import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FindOptionsWhere } from 'typeorm';
import {
  CreateUserResponse,
  GetUserResponse,
  UserSaveResponseData,
} from '../types';
import { createHashPwd } from '../common/utils/create-hash-pwd';

@Injectable()
export class UserService {
  async getUser(where: FindOptionsWhere<User>): Promise<User> {
    return User.findOne({ where });
  }

  async create(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    await this.checkUserFieldUniquenessAndThrow({
      email: createUserDto.email,
    });
    await this.checkUserFieldUniquenessAndThrow({
      username: createUserDto.username,
    });

    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.hashPwd = await createHashPwd(createUserDto.password);
    await user.save();

    return this.filter(user);
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

  async checkUserFieldUniquenessAndThrow(value: {
    [key: string]: any;
  }): Promise<void> {
    const isUniqueness = await this.checkUserFieldUniqueness(value);

    const [key] = Object.keys(value);
    if (!isUniqueness) throw new ConflictException(`${key} is not unique`);
  }

  async checkUserFieldUniqueness(value: {
    [key: string]: any;
  }): Promise<boolean> {
    const user = await User.findOne({
      where: value,
    });

    return !user;
  }

  filter(userEntity: User): UserSaveResponseData {
    const { jwtId, hashPwd, photoFn, ...userResponse } = userEntity;

    return { ...userResponse, avatar: `/user/photo/${userResponse.id}` };
  }
}
