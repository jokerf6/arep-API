import { Body, Controller, Delete, Param, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { tag } from 'src/globals/helpers/tag.helper';
import { ResponseService } from 'src/globals/services/response.service';
import { ScheduleService } from '../services/store.schedule.service';
import { Response } from 'express';
import { CreateScheduleDTO } from '../dto/store.schedule.dto';
import { CanUserAccessModelRowId } from 'src/decorators/api/CanUserAccessModelRowId.decorator';
import { ScheduleHelpersService } from '../services/store.schedule.helper.service';
import { AttachStoreId } from 'src/decorators/api/attachStoreIdInterceptor.decorator';
import { ApiRequiredIdParam } from 'src/decorators/api/id-params.decorator';
import { RequiredIdParam } from 'src/dtos/params/id-param.dto';
import { Auth } from 'src/_modules/authentication/decorators/auth.decorator';

const prefix = 'schedule';

@Controller(prefix)
@ApiTags(tag(prefix))
@Auth({ prefix })
export class StoreScheduleController {
  constructor(
    private readonly service: ScheduleService,
    private readonly response: ResponseService,
    private readonly helpers: ScheduleHelpersService,
  ) {}

    @Post('/')
    @AttachStoreId()
     async create(@Res() res: Response, @Body() body: CreateScheduleDTO,   ) {
await this.helpers.scheduleOverlap(body.storeId,body);
    const schedule = await this.service.createSchedule(body);

   return this.response.success(res, 'store schedule created successfully', schedule);
    }
        @Delete('/:id')
    @ApiRequiredIdParam('id')

    @CanUserAccessModelRowId({
        prefix,
        modelName: 'storeSchedule',
        ownerCurrentUserField: 'storeId',
        ownerFieldName: 'storeId',
    })
     async delete(@Res() res: Response, @Param() { id }: RequiredIdParam) {
    const schedule = await this.service.deleteSchedule(id);
   return this.response.success(res, 'store schedule deleted successfully', schedule);
    }
}
