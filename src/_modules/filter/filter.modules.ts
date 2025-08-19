import { Module } from '@nestjs/common';
import { FilterModuleDTO } from '../module/dto/module.dto';
import { FilterService } from './services/filter.service';
import { FilterController } from './controllers/filter.controller';


@Module({
  imports: [],
  controllers: [FilterController],
  providers: [FilterService],
})
export class FilterModule {}
