import { Injectable, NotFoundException } from '@nestjs/common';
import { CollegesRepository } from '../colleges/colleges.repository';
import { DiscussionsRepository } from './discussions.repository';
import {
  CreateAnswerDto,
  CreateQuestionDto,
  DiscussionQueryDto,
} from './dto/discussion.dto';
import { buildPaginationMeta } from '../../utils/helpers';

@Injectable()
export class DiscussionsService {
  constructor(
    private readonly discussionsRepository: DiscussionsRepository,
    private readonly collegesRepository: CollegesRepository,
  ) {}

  async askQuestion(userId: string, dto: CreateQuestionDto) {
    const college = await this.collegesRepository.findById(dto.collegeId);

    if (!college) {
      throw new NotFoundException('College not found');
    }

    return this.discussionsRepository.createQuestion(userId, dto);
  }

  async answerQuestion(
    userId: string,
    questionId: string,
    dto: CreateAnswerDto,
  ) {
    const question = await this.discussionsRepository.findById(questionId);

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return this.discussionsRepository.createAnswer(userId, questionId, dto);
  }

  async browseDiscussions(query: DiscussionQueryDto) {
    if (query.collegeId) {
      const college = await this.collegesRepository.findById(query.collegeId);
      if (!college) {
        throw new NotFoundException('College not found');
      }
    }

    const { questions, total, page, limit } =
      await this.discussionsRepository.findMany(query);

    return {
      success: true,
      data: questions,
      pagination: buildPaginationMeta(page, limit, total),
    };
  }

  async getDiscussion(questionId: string) {
    const question = await this.discussionsRepository.findById(questionId);

    if (!question) {
      throw new NotFoundException('Discussion not found');
    }

    return question;
  }
}
