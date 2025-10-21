import { Controller, Get, Res } from '@nestjs/common';
import { ApiQuery, ApiTags, PartialType } from '@nestjs/swagger';
import { Response } from 'express';
import { Auth } from 'src/_modules/authentication/decorators/auth.decorator';
import { Filter } from 'src/decorators/param/filter.decorator';
import { ResponseService } from 'src/globals/services/response.service';

import { tag } from 'src/globals/helpers/tag.helper';
import { FilterStatisticsDTO } from './dto/statistics.dto';
import { StatisticsService } from './statistics.service';

const prefix = 'statistics';

@Controller(prefix)
@ApiTags(tag(prefix))
export class StatisticsController {
  constructor(
    private readonly service: StatisticsService,
    private readonly response: ResponseService,
  ) {}

  @Get('/')
  @Auth({ prefix })
  @ApiQuery({ type: PartialType(FilterStatisticsDTO) })
  async findAll(
    @Res() res: Response,
    @Filter({ dto: FilterStatisticsDTO }) filters: FilterStatisticsDTO,
  ) {
    const data = await this.service.getStatistics(filters);

    return this.response.success(res, 'Statistics fetched successfully', data);
  }
}
