import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { ApiQuery, ApiTags, PartialType } from '@nestjs/swagger';
import { Response } from 'express';
import { Auth } from 'src/_modules/authentication/decorators/auth.decorator';
import { Filter } from 'src/decorators/param/filter.decorator';
import { tag } from 'src/globals/helpers/tag.helper';
import { ResponseService } from 'src/globals/services/response.service';
import { FilterNotificationDTO } from '../dto/notification.dto';
import { NotificationService } from '../services/notification.service';
import { UploadFile } from 'src/decorators/api/upload-file.decorator';
import { CreateNotificationDTO } from '../dto/notification.create.dto';
import { CurrentUser } from 'src/_modules/authentication/decorators/current-user.decorator';
import { CanUserAccessModelRowId } from 'src/decorators/api/CanUserAccessModelRowId.decorator';
import { RequiredIdParam } from 'src/dtos/params/id-param.dto';
import { ApiRequiredIdParam } from 'src/decorators/api/id-params.decorator';

const prefix = 'notifications';
@Controller(prefix)
@ApiTags(tag(prefix))
@Auth({})
export class NotificationController {
  constructor(
    private service: NotificationService,
    private response: ResponseService,
  ) { }

  @Get('/')
  @Auth()
  @ApiQuery({ type: PartialType(FilterNotificationDTO) })
  async findAll(
    @Res() res: Response,
    @Filter({ dto: FilterNotificationDTO }) filters: FilterNotificationDTO,
  ) {
    const { data, total } = await this.service.findNotification(filters);

    return this.response.success(
      res,
      'notification fetched successfully',
      data,
      {
        total,
      },
    );
  }
}
