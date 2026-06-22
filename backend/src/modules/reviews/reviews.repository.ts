import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        userId,
        collegeId: dto.collegeId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });
  }

  async findByCollegeId(collegeId: string) {
    return this.prisma.review.findMany({
      where: { collegeId },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateCollegeRating(collegeId: string) {
    const aggregate = await this.prisma.review.aggregate({
      where: { collegeId },
      _avg: { rating: true },
    });

    await this.prisma.college.update({
      where: { id: collegeId },
      data: { rating: aggregate._avg.rating ?? 0 },
    });
  }
}
