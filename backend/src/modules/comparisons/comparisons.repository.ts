import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ComparisonsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createComparison(
    userId: string,
    name: string,
    collegeIds: string[],
  ) {
    return this.prisma.comparison.create({
      data: {
        userId,
        name,
        colleges: {
          create: collegeIds.map((collegeId, position) => ({
            collegeId,
            position,
          })),
        },
      },
      include: this.comparisonInclude,
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.comparison.findMany({
      where: { userId },
      include: this.comparisonInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByIdForUser(id: string, userId: string) {
    return this.prisma.comparison.findFirst({
      where: { id, userId },
      include: this.comparisonInclude,
    });
  }

  async deleteByIdForUser(id: string, userId: string) {
    const comparison = await this.findByIdForUser(id, userId);

    if (!comparison) {
      throw new NotFoundException('Saved comparison not found');
    }

    await this.prisma.comparison.delete({ where: { id } });
    return comparison;
  }

  private comparisonInclude = {
    colleges: {
      orderBy: { position: 'asc' as const },
      include: {
        college: {
          include: { placement: true },
        },
      },
    },
  };
}
