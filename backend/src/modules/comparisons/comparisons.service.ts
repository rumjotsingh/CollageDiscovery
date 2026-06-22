import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CollegesRepository } from '../colleges/colleges.repository';
import { ComparisonsRepository } from './comparisons.repository';
import { CompareCollegesDto, SaveComparisonDto } from './dto/comparison.dto';

@Injectable()
export class ComparisonsService {
  constructor(
    private readonly collegesRepository: CollegesRepository,
    private readonly comparisonsRepository: ComparisonsRepository,
  ) {}

  async compare(dto: CompareCollegesDto, userId?: string) {
    const uniqueIds = this.validateCollegeIds(dto.collegeIds);
    const colleges = await this.loadCollegesInOrder(uniqueIds);
    const comparisonData = colleges.map((college) => this.toCompareCollege(college));

    if (userId && dto.name) {
      await this.comparisonsRepository.createComparison(
        userId,
        dto.name.trim(),
        uniqueIds,
      );
    }

    return comparisonData;
  }

  async saveComparison(userId: string, dto: SaveComparisonDto) {
    const uniqueIds = this.validateCollegeIds(dto.collegeIds);
    await this.loadCollegesInOrder(uniqueIds);

    const saved = await this.comparisonsRepository.createComparison(
      userId,
      dto.name.trim(),
      uniqueIds,
    );

    return this.formatSavedComparison(saved);
  }

  async getSavedComparisons(userId: string) {
    const comparisons = await this.comparisonsRepository.findByUserId(userId);
    return comparisons.map((comparison) => this.formatSavedComparison(comparison));
  }

  async getSavedComparison(userId: string, id: string) {
    const comparison = await this.comparisonsRepository.findByIdForUser(id, userId);

    if (!comparison) {
      throw new NotFoundException('Saved comparison not found');
    }

    const collegeIds = comparison.colleges.map((entry) => entry.collegeId);
    const colleges = await this.loadCollegesInOrder(collegeIds);

    return {
      ...this.formatSavedComparison(comparison),
      comparison: colleges.map((college) => this.toCompareCollege(college)),
    };
  }

  async deleteSavedComparison(userId: string, id: string) {
    await this.comparisonsRepository.deleteByIdForUser(id, userId);
    return { message: 'Comparison deleted successfully' };
  }

  private validateCollegeIds(collegeIds: string[]) {
    const uniqueIds = [...new Set(collegeIds)];

    if (uniqueIds.length !== collegeIds.length) {
      throw new BadRequestException('Duplicate college IDs are not allowed');
    }

    return uniqueIds;
  }

  private async loadCollegesInOrder(collegeIds: string[]) {
    const colleges = await this.collegesRepository.findByIds(collegeIds);

    if (colleges.length !== collegeIds.length) {
      throw new BadRequestException('One or more colleges not found');
    }

    const collegeMap = new Map(colleges.map((college) => [college.id, college]));
    return collegeIds.map((id) => collegeMap.get(id)!);
  }

  private toCompareCollege(college: Awaited<
    ReturnType<CollegesRepository['findByIds']>
  >[number]) {
    return {
      id: college.id,
      name: college.name,
      slug: college.slug,
      location: college.location,
      state: college.state,
      fees: college.fees,
      rating: college.rating,
      establishedYear: college.establishedYear,
      courses: college.courses,
      placement: college.placement
        ? {
            averagePackage: college.placement.averagePackage,
            highestPackage: college.placement.highestPackage,
            placementPercentage: college.placement.placementPercentage,
          }
        : null,
    };
  }

  private formatSavedComparison(
    comparison: Awaited<
      ReturnType<ComparisonsRepository['findByUserId']>
    >[number],
  ) {
    return {
      id: comparison.id,
      name: comparison.name,
      createdAt: comparison.createdAt,
      collegeIds: comparison.colleges.map((entry) => entry.collegeId),
      colleges: comparison.colleges.map((entry) => ({
        id: entry.college.id,
        name: entry.college.name,
        slug: entry.college.slug,
        location: entry.college.location,
        state: entry.college.state,
        fees: entry.college.fees,
        rating: entry.college.rating,
        placement: entry.college.placement,
      })),
    };
  }
}
