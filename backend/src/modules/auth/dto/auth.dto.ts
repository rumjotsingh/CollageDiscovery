import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Rahul Sharma' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'rahul@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'SecurePass123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;
}

export class LoginDto {
  @ApiProperty({ example: 'rahul@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({
    example: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: 'uuid',
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        role: 'USER',
      },
    },
  })
  data!: {
    accessToken: string;
    user: Record<string, unknown>;
  };
}

export class ProfileResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({
    example: {
      id: 'uuid',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      role: 'USER',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  })
  data!: Record<string, unknown>;
}
