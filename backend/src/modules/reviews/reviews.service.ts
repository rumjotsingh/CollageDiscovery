import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CollegesRepository } from '../colleges/colleges.repository';
import { ReviewsRepository } from './reviews.repository';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly collegesRepository: CollegesRepository,
  ) {}

  async create(userId: string, dto: CreateReviewDto) {
    const college = await this.collegesRepository.findById(dto.collegeId);

    if (!college) {
      throw new NotFoundException('College not found');
    }

    try {
      const review = await this.reviewsRepository.create(userId, dto);
      await this.reviewsRepository.updateCollegeRating(dto.collegeId);
      return review;
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code: string }).code === 'P2002'
      ) {
        throw new ConflictException('You have already reviewed this college');
      }
      throw error;
    }
  }

  async findByCollegeId(collegeId: string) {
    const college = await this.collegesRepository.findById(collegeId);

    if (!college) {
      throw new NotFoundException('College not found');
    }

    return this.reviewsRepository.findByCollegeId(collegeId);
  }
}
