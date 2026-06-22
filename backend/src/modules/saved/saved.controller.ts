import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SavedService } from './saved.service';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/api-response.interface';
import {
  ApiErrorResponseDto,
  ApiSuccessResponseDto,
} from '../common/dto/pagination.dto';

@ApiTags('Saved Colleges')
@ApiBearerAuth()
@Controller('saved')
export class SavedController {
  constructor(private readonly savedService: SavedService) {}

  @Post(':collegeId')
  @ApiOperation({ summary: 'Save a college to favorites' })
  @ApiParam({ name: 'collegeId', description: 'College UUID' })
  @ApiResponse({ status: 201, type: ApiSuccessResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  @ApiResponse({ status: 409, type: ApiErrorResponseDto })
  async saveCollege(
    @CurrentUser() user: AuthenticatedUser,
    @Param('collegeId') collegeId: string,
  ) {
    return this.savedService.saveCollege(user.id, collegeId);
  }

  @Delete(':collegeId')
  @ApiOperation({ summary: 'Remove a college from favorites' })
  @ApiParam({ name: 'collegeId', description: 'College UUID' })
  @ApiResponse({ status: 200, type: ApiSuccessResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  async removeCollege(
    @CurrentUser() user: AuthenticatedUser,
    @Param('collegeId') collegeId: string,
  ) {
    return this.savedService.removeCollege(user.id, collegeId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all saved colleges for authenticated user' })
  @ApiResponse({ status: 200, type: ApiSuccessResponseDto })
  async getSavedColleges(@CurrentUser() user: AuthenticatedUser) {
    return this.savedService.getSavedColleges(user.id);
  }
}
