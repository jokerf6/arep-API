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

const prefix = 'notification';
@Controller(prefix)
@ApiTags(tag(prefix))
@Auth({})
export class NotificationController {
  constructor(
    private service: NotificationService,
    private response: ResponseService,
  ) {}

  @Get('/notifications')
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
    @Post('/')
    @UploadFile('image')
    async create(@Res() res: Response, @Body() body: CreateNotificationDTO) {
      await this.service.create(body);
      return this.response.created(res, 'notification created successfully');
    }
    @Patch('/mark-read')
      async markAllAsRead(@Res() res: Response, @CurrentUser() user: CurrentUser) {
      await this.service.markAllAsRead(user.id);
      return this.response.created(res, 'notification marked as read successfully');
    }
        @Patch('/:id/mark-read')
        @ApiRequiredIdParam('id')
        @CanUserAccessModelRowId({
          prefix,
          modelName: 'notification',
        })
      async mark(@Res() res: Response,@Param() { id }: RequiredIdParam) {
      await this.service.markNotificationAsRead(id);
      return this.response.created(res, 'notification marked as read successfully');
    }
}
