import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CollegesService } from './colleges.service';
import { CollegeQueryDto } from './dto/college.dto';
import { Public } from '../../decorators/roles.decorator';
import {
  ApiErrorResponseDto,
  ApiSuccessResponseDto,
} from '../common/dto/pagination.dto';

@ApiTags('Colleges')
@Controller('colleges')
export class CollegesController {
  constructor(private readonly collegesService: CollegesService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Browse colleges with pagination, search, sort, and filters',
  })
  @ApiResponse({ status: 200, type: ApiSuccessResponseDto })
  async findAll(@Query() query: CollegeQueryDto) {
    return this.collegesService.findAll(query);
  }

  @Public()
  @Get('by-slug/:slug')
  @ApiOperation({ summary: 'Get college by URL slug' })
  @ApiParam({ name: 'slug', description: 'College slug' })
  @ApiResponse({ status: 200, type: ApiSuccessResponseDto })
  async findBySlug(@Param('slug') slug: string) {
    return this.collegesService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get college details with courses, placements, reviews' })
  @ApiParam({ name: 'id', description: 'College UUID' })
  @ApiResponse({ status: 200, type: ApiSuccessResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  async findOne(@Param('id') id: string) {
    return this.collegesService.findOne(id);
  }
}
