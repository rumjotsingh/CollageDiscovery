import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CollegesRepository } from '../colleges/colleges.repository';
import { SavedRepository } from './saved.repository';

@Injectable()
export class SavedService {
  constructor(
    private readonly savedRepository: SavedRepository,
    private readonly collegesRepository: CollegesRepository,
  ) {}

  async saveCollege(userId: string, collegeId: string) {
    const college = await this.collegesRepository.findById(collegeId);

    if (!college) {
      throw new NotFoundException('College not found');
    }

    const existing = await this.savedRepository.exists(userId, collegeId);
    if (existing) {
      throw new ConflictException('College already saved');
    }

    const saved = await this.savedRepository.save(userId, collegeId);
    return saved.college;
  }

  async removeCollege(userId: string, collegeId: string) {
    try {
      await this.savedRepository.remove(userId, collegeId);
      return { message: 'College removed from saved list' };
    } catch {
      throw new NotFoundException('Saved college not found');
    }
  }

  async getSavedColleges(userId: string) {
    const saved = await this.savedRepository.findByUserId(userId);
    return saved.map((entry) => entry.college);
  }
}
