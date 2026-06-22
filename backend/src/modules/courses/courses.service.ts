import { Injectable, NotFoundException } from '@nestjs/common';
import { CoursesRepository } from './courses.repository';
import { buildPaginationMeta } from '../../utils/helpers';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async findAll(search?: string, page = 1, limit = 20) {
    const { courses, total, page: p, limit: l } =
      await this.coursesRepository.findMany(search, page, limit);

    return {
      success: true,
      data: courses,
      pagination: buildPaginationMeta(p, l, total),
    };
  }

  async findOne(id: string) {
    const course = await this.coursesRepository.findById(id);
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }
}
