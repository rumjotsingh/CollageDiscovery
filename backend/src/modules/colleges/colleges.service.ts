import { Injectable, NotFoundException } from '@nestjs/common';
import { CollegesRepository } from './colleges.repository';
import { CollegeQueryDto } from './dto/college.dto';
import { buildPaginationMeta } from '../../utils/helpers';

@Injectable()
export class CollegesService {
  constructor(private readonly collegesRepository: CollegesRepository) {}

  async findAll(query: CollegeQueryDto) {
    const { colleges, total, page, limit } =
      await this.collegesRepository.findMany(query);

    return {
      success: true,
      data: colleges,
      pagination: buildPaginationMeta(page, limit, total),
    };
  }

  async findOne(id: string) {
    const college = await this.collegesRepository.findById(id);

    if (!college) {
      throw new NotFoundException('College not found');
    }

    return college;
  }

  async findBySlug(slug: string) {
    const college = await this.collegesRepository.findBySlug(slug);

    if (!college) {
      throw new NotFoundException('College not found');
    }

    return college;
  }
}
