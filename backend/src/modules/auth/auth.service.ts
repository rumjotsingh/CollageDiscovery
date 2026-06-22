import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtPayload } from '../common/interfaces/api-response.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(
      dto.name,
      dto.email,
      dto.password,
    );

    const accessToken = await this.generateToken(user);

    return { accessToken, user };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.validateUser(dto.email, dto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.generateToken(user);

    return { accessToken, user };
  }

  async getProfile(userId: string) {
    return this.usersService.getProfile(userId);
  }

  private async generateToken(user: {
    id: string;
    email: string;
    role: string;
  }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('app.jwtSecret'),
      expiresIn: this.configService.get<string>('app.jwtExpiresIn'),
    });
  }
}
