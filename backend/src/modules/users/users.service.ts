import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { sanitizeUser } from '../../utils/helpers';

@Injectable()
export class UsersService {
  private readonly saltRounds = 12;

  constructor(private readonly usersRepository: UsersRepository) {}

  async create(name: string, email: string, password: string) {
    const existing = await this.usersRepository.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return sanitizeUser(user);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    return sanitizeUser(user);
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return sanitizeUser(user);
  }
}
