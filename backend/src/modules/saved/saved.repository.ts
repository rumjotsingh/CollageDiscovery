import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SavedRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(userId: string, collegeId: string) {
    return this.prisma.savedCollege.create({
      data: { userId, collegeId },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            slug: true,
            location: true,
            state: true,
            fees: true,
            rating: true,
            establishedYear: true,
          },
        },
      },
    });
  }

  async remove(userId: string, collegeId: string) {
    return this.prisma.savedCollege.delete({
      where: {
        userId_collegeId: { userId, collegeId },
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.savedCollege.findMany({
      where: { userId },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            slug: true,
            location: true,
            state: true,
            fees: true,
            rating: true,
            establishedYear: true,
            overview: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  async exists(userId: string, collegeId: string) {
    return this.prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: { userId, collegeId },
      },
    });
  }
}
