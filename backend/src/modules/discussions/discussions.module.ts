import { Module } from '@nestjs/common';
import { DiscussionsController } from './discussions.controller';
import { DiscussionsService } from './discussions.service';
import { DiscussionsRepository } from './discussions.repository';
import { CollegesModule } from '../colleges/colleges.module';

@Module({
  imports: [CollegesModule],
  controllers: [DiscussionsController],
  providers: [DiscussionsService, DiscussionsRepository],
})
export class DiscussionsModule {}
