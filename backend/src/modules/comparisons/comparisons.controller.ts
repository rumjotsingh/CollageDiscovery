import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ComparisonsService } from './comparisons.service';
import { CompareCollegesDto, SaveComparisonDto } from './dto/comparison.dto';
import { Public } from '../../decorators/roles.decorator';
import { OptionalUser } from '../../decorators/optional-user.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from '../../guards/optional-jwt-auth.guard';
import { AuthenticatedUser } from '../common/interfaces/api-response.interface';
import {
  ApiErrorResponseDto,
  ApiSuccessResponseDto,
} from '../common/dto/pagination.dto';

@ApiTags('Comparisons')
@Controller()
export class ComparisonsController {
  constructor(private readonly comparisonsService: ComparisonsService) {}

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Post('compare')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Compare colleges side-by-side',
    description:
      'Pass optional name when authenticated to save the comparison',
  })
  @ApiResponse({ status: 200, type: ApiSuccessResponseDto })
  @ApiResponse({ status: 400, type: ApiErrorResponseDto })
  async compare(
    @Body() dto: CompareCollegesDto,
    @OptionalUser() user?: AuthenticatedUser,
  ) {
    return this.comparisonsService.compare(dto, user?.id);
  }

  @Post('comparisons')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save a comparison for the authenticated user' })
  @ApiResponse({ status: 201, type: ApiSuccessResponseDto })
  @ApiResponse({ status: 400, type: ApiErrorResponseDto })
  async saveComparison(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SaveComparisonDto,
  ) {
    return this.comparisonsService.saveComparison(user.id, dto);
  }

  @Get('comparisons')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get saved comparisons for authenticated user' })
  @ApiResponse({ status: 200, type: ApiSuccessResponseDto })
  async getSavedComparisons(@CurrentUser() user: AuthenticatedUser) {
    return this.comparisonsService.getSavedComparisons(user.id);
  }

  @Get('comparisons/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a saved comparison with full compare data' })
  @ApiParam({ name: 'id', description: 'Saved comparison UUID' })
  @ApiResponse({ status: 200, type: ApiSuccessResponseDto })
  @ApiResponse({ status: 400, type: ApiErrorResponseDto })
  async getSavedComparison(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.comparisonsService.getSavedComparison(user.id, id);
  }

  @Delete('comparisons/:id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a saved comparison' })
  @ApiParam({ name: 'id', description: 'Saved comparison UUID' })
  @ApiResponse({ status: 200, type: ApiSuccessResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  async deleteSavedComparison(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.comparisonsService.deleteSavedComparison(user.id, id);
  }
}
