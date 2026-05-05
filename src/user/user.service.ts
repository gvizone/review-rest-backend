import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './domain/user.entity';
import type { UserRepository } from './domain/user.repository';
import { USER_REPOSITORY } from './domain/user.repository.token';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteResult } from 'typeorm';

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

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(UserService.normalizeEmail(email));
  }

  async create(dto: CreateUserDto): Promise<User> {
    const email = UserService.normalizeEmail(dto.email);
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }
    return this.userRepository.create({
      name: dto.name.trim(),
      email,
      address: dto.address,
      ...(dto.image !== undefined && dto.image !== ''
        ? { image: dto.image }
        : {}),
    });
  }

  private static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  async updateImage(id: string, image: string | null): Promise<User> {
    const updated = await this.userRepository.updateImage(id, image);
    if (!updated) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return updated;
  }

  deleteAll(): Promise<DeleteResult> {
    return this.userRepository.deleteAll();
  }
}
