import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './domain/user.entity';
import type { UserRepository } from './domain/user.repository';
import { USER_REPOSITORY } from './domain/user.repository.token';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  create(dto: CreateUserDto): Promise<User> {
    return this.userRepository.create({
      name: dto.name,
      email: dto.email,
      address: dto.address,
    });
  }
}
