import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  Delete,
} from '@nestjs/common';
import { ApiQuery, ApiTags, PartialType, ApiOkResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { Auth } from 'src/_modules/authentication/decorators/auth.decorator';
import { ApiRequiredIdParam } from 'src/decorators/api/id-params.decorator';
import { Filter } from 'src/decorators/param/filter.decorator';
import { RequiredIdParam } from 'src/dtos/params/id-param.dto';
import { ResponseService } from 'src/globals/services/response.service';
import { buildExamples } from 'src/globals/helpers/generate-example.helper';
import {
  CreateSystemNotificationDTO,
  FilterSystemNotificationDTO,
  UpdateSystemNotificationDTO,
} from './dto/system-notification.dto';
import { tag } from 'src/globals/helpers/tag.helper';
import { isOne } from 'src/globals/helpers/first-or-many';
import { SystemNotificationService } from './system-notification.service';
import { selectSystemNotificationOBJ } from './prisma-args/system-notification.prisma.args';

const prefix = 'system-notifications';

@Controller(prefix)
@ApiTags(tag(prefix))
@Auth({ prefix })
export class SystemNotificationController {
  constructor(
    private readonly service: SystemNotificationService,
    private readonly response: ResponseService,
  ) {}

  @Patch('/:id')
  @ApiRequiredIdParam()
  async update(
    @Res() res: Response,
    @Param() { id }: RequiredIdParam,
    @Body() body: UpdateSystemNotificationDTO,
  ) {
    await this.service.update(id, body);
    return this.response.created(
      res,
      'system-notification updated successfully',
    );
  }
  @Get(['/', '/:id'])
  @ApiOkResponse(
    buildExamples([
      {
        title: 'Get All SystemNotification',
        paginated: false,
        body: selectSystemNotificationOBJ(),
      },
    ]),
  )
  @ApiQuery({ type: PartialType(FilterSystemNotificationDTO) })
  async findAll(
    @Res() res: Response,
    @Filter({ dto: FilterSystemNotificationDTO })
    filters: FilterSystemNotificationDTO,
  ) {
    const data = await this.service.findAll(filters);

    return this.response.success(
      res,
      'system-notification fetched successfully',
      data,
    );
  }
}
