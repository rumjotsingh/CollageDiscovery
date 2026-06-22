import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAnswerDto, CreateQuestionDto, DiscussionQueryDto } from './dto/discussion.dto';
import { getSkip } from '../../utils/helpers';

const questionListSelect = {
  id: true,
  title: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  user: { select: { id: true, name: true } },
  college: { select: { id: true, name: true, slug: true } },
  _count: { select: { answers: true } },
  answers: {
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'asc' as const },
  },
} satisfies Prisma.QuestionSelect;

const questionDetailInclude = {
  user: { select: { id: true, name: true } },
  college: { select: { id: true, name: true, slug: true, location: true, state: true } },
  answers: {
    include: {
      user: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'asc' as const },
  },
} satisfies Prisma.QuestionInclude;

@Injectable()
export class DiscussionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createQuestion(userId: string, dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
        userId,
        collegeId: dto.collegeId,
        title: dto.title,
        content: dto.content,
      },
      select: questionListSelect,
    });
  }

  async createAnswer(userId: string, questionId: string, dto: CreateAnswerDto) {
    const [answer] = await this.prisma.$transaction([
      this.prisma.answer.create({
        data: {
          userId,
          questionId,
          content: dto.content,
        },
        include: {
          user: { select: { id: true, name: true } },
        },
      }),
      this.prisma.question.update({
        where: { id: questionId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return answer;
  }

  async findMany(query: DiscussionQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = getSkip(page, limit);
    const where = this.buildWhereClause(query);
    const orderBy = this.buildOrderBy(query);

    const [questions, total] = await this.prisma.$transaction([
      this.prisma.question.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: questionListSelect,
      }),
      this.prisma.question.count({ where }),
    ]);

    return { questions, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.question.findUnique({
      where: { id },
      include: questionDetailInclude,
    });
  }

  private buildWhereClause(query: DiscussionQueryDto): Prisma.QuestionWhereInput {
    const where: Prisma.QuestionWhereInput = {};

    if (query.collegeId) {
      where.collegeId = query.collegeId;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private buildOrderBy(
    query: DiscussionQueryDto,
  ): Prisma.QuestionOrderByWithRelationInput {
    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'desc';
    return { [sortBy]: sortOrder };
  }
}
