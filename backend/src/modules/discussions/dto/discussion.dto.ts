import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

export class CreateQuestionDto {
  @ApiProperty({ example: 'college-uuid' })
  @IsUUID()
  collegeId!: string;

  @ApiProperty({ example: 'What is the hostel fee structure?' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  title!: string;

  @ApiProperty({
    example:
      'I am planning to join next year. Can someone share details about single and shared room fees?',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(5000)
  content!: string;
}

export class CreateAnswerDto {
  @ApiProperty({
    example:
      'Single occupancy costs around ₹1.2L per year. Shared rooms are ₹80k. Mess is separate.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(5000)
  content!: string;
}

export class DiscussionQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'college-uuid' })
  @IsOptional()
  @IsUUID()
  collegeId?: string;

  @ApiPropertyOptional({ example: 'hostel fees' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'createdAt',
    enum: ['createdAt', 'updatedAt', 'title'],
  })
  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'title'])
  sortBy?: 'createdAt' | 'updatedAt' | 'title' = 'createdAt';

  @ApiPropertyOptional({ example: 'desc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
