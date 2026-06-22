import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../decorators/roles.decorator';
import { CoursesService } from './courses.service';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all courses across colleges' })
  async findAll(
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.coursesService.findAll(search, page, limit);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get course detail with college info' })
  async findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }
}
