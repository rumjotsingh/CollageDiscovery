import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { getSkip } from '../../utils/helpers';

@Injectable()
export class CoursesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(search?: string, page = 1, limit = 20) {
    const skip = getSkip(page, limit);
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { college: { name: { contains: search, mode: 'insensitive' as const } } },
          ],
        }
      : {};

    const [courses, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: {
          college: {
            select: {
              id: true,
              name: true,
              slug: true,
              location: true,
              state: true,
              rating: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    return { courses, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            slug: true,
            location: true,
            state: true,
            rating: true,
            fees: true,
          },
        },
      },
    });
  }
}
