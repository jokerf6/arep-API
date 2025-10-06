import { Body, Controller, Get, Post, Res } from '@nestjs/common';
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
      return this.response.created(res, 'category created successfully');
    }
  
}
