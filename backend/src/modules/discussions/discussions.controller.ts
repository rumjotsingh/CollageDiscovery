import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DiscussionsService } from './discussions.service';
import {
  CreateAnswerDto,
  CreateQuestionDto,
  DiscussionQueryDto,
} from './dto/discussion.dto';
import { Public } from '../../decorators/roles.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/api-response.interface';
import {
  ApiErrorResponseDto,
  ApiSuccessResponseDto,
} from '../common/dto/pagination.dto';

@ApiTags('Discussions')
@Controller('discussions')
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @Post('questions')
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ask a question about a college' })
  @ApiResponse({ status: 201, type: ApiSuccessResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  async askQuestion(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateQuestionDto,
  ) {
    return this.discussionsService.askQuestion(user.id, dto);
  }

  @Post('questions/:questionId/answers')
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Answer a question' })
  @ApiParam({ name: 'questionId', description: 'Question UUID' })
  @ApiResponse({ status: 201, type: ApiSuccessResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  async answerQuestion(
    @CurrentUser() user: AuthenticatedUser,
    @Param('questionId', ParseUUIDPipe) questionId: string,
    @Body() dto: CreateAnswerDto,
  ) {
    return this.discussionsService.answerQuestion(user.id, questionId, dto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Browse discussions with pagination, search, and college filter',
  })
  @ApiResponse({ status: 200, type: ApiSuccessResponseDto })
  async browseDiscussions(@Query() query: DiscussionQueryDto) {
    return this.discussionsService.browseDiscussions(query);
  }

  @Public()
  @Get(':questionId')
  @ApiOperation({ summary: 'Get a discussion thread with all answers' })
  @ApiParam({ name: 'questionId', description: 'Question UUID' })
  @ApiResponse({ status: 200, type: ApiSuccessResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  async getDiscussion(@Param('questionId', ParseUUIDPipe) questionId: string) {
    return this.discussionsService.getDiscussion(questionId);
  }
}
