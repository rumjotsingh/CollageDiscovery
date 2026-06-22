import { Module } from '@nestjs/common';
import { ComparisonsController } from './comparisons.controller';
import { ComparisonsService } from './comparisons.service';
import { ComparisonsRepository } from './comparisons.repository';
import { CollegesModule } from '../colleges/colleges.module';

@Module({
  imports: [CollegesModule],
  controllers: [ComparisonsController],
  providers: [ComparisonsService, ComparisonsRepository],
})
export class ComparisonsModule {}
