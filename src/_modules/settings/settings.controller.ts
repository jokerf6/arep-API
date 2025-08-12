import { Body, Controller, Get, Patch, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ApiFilter } from 'src/decorators/api/filter.decorator';
import { Filter } from 'src/decorators/param/filter.decorator';
import { ResponseService } from 'src/globals/services/response.service';
import { SettingFilter, UpdateSettingDTO } from './dto/setting';
import { SettingsService } from './settings.service';
import { Auth } from '../authentication/decorators/auth.decorator';
import { tag } from 'src/globals/helpers/tag.helper';

const prefix = 'settings';
@Controller(prefix)
@ApiTags(tag(prefix))
 @Auth({ prefix })
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly responses: ResponseService,
  ) {}

  @Get(['/'])
  @ApiFilter(SettingFilter)
  async get(
    @Res() res: Response,
    @Filter({ dto: SettingFilter }) filters: SettingFilter,
  ) {
    const data = await this.settingsService.get(filters);
    return this.responses.success(
      res,
      'get settings successfully',
      data,
    );
  }

  @Patch('/')
  async update(
    @Res() res: Response,
    @Body() body: UpdateSettingDTO,
  ) {
    await this.settingsService.update(body);
    return this.responses.success(res, 'update settings successfully');
  }
}
