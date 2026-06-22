import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CompareCollegesDto {
  @ApiProperty({
    example: ['uuid-1', 'uuid-2'],
    description: '2 to 5 college IDs to compare',
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(5)
  @IsUUID('4', { each: true })
  collegeIds!: string[];

  @ApiProperty({ example: 'My Top Choices', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;
}

export class SaveComparisonDto {
  @ApiProperty({ example: 'My Top IIT Choices' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: ['uuid-1', 'uuid-2'] })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(5)
  @IsUUID('4', { each: true })
  collegeIds!: string[];
}
