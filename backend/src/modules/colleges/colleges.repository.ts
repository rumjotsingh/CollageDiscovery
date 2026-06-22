import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CollegeQueryDto } from './dto/college.dto';
import { getSkip } from '../../utils/helpers';

@Injectable()
export class CollegesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(query: CollegeQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = getSkip(page, limit);

    const where = this.buildWhereClause(query);
    const orderBy = this.buildOrderBy(query);

    const [colleges, total] = await this.prisma.$transaction([
      this.prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          location: true,
          state: true,
          fees: true,
          pgFees: true,
          rating: true,
          academicScore: true,
          accommodationScore: true,
          facultyScore: true,
          infrastructureScore: true,
          placementScore: true,
          socialLifeScore: true,
          overview: true,
          establishedYear: true,
          createdAt: true,
          _count: { select: { reviews: true } },
        },
      }),
      this.prisma.college.count({ where }),
    ]);

    return { colleges, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.college.findUnique({
      where: { id },
      include: {
        courses: true,
        placement: true,
        reviews: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.college.findUnique({
      where: { slug },
      include: {
        courses: true,
        placement: true,
        reviews: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async findByIds(ids: string[]) {
    return this.prisma.college.findMany({
      where: { id: { in: ids } },
      include: {
        placement: true,
        courses: { select: { id: true, name: true, duration: true, fees: true } },
      },
    });
  }

  private buildWhereClause(query: CollegeQueryDto): Prisma.CollegeWhereInput {
    const where: Prisma.CollegeWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { location: { contains: query.search, mode: 'insensitive' } },
        { state: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.location) {
      where.location = { contains: query.location, mode: 'insensitive' };
    }

    if (query.state) {
      where.state = { contains: query.state, mode: 'insensitive' };
    }

    if (query.minFees !== undefined || query.maxFees !== undefined) {
      where.fees = {};
      if (query.minFees !== undefined) {
        where.fees.gte = query.minFees;
      }
      if (query.maxFees !== undefined) {
        where.fees.lte = query.maxFees;
      }
    }

    if (query.rating !== undefined) {
      where.rating = { gte: query.rating };
    }

    return where;
  }

  private buildOrderBy(
    query: CollegeQueryDto,
  ): Prisma.CollegeOrderByWithRelationInput {
    const sortBy = query.sortBy ?? 'rating';
    const sortOrder = query.sortOrder ?? 'desc';

    return { [sortBy]: sortOrder };
  }
}
