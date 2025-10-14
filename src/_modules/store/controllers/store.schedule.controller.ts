import { Body, Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { tag } from 'src/globals/helpers/tag.helper';
import { ResponseService } from 'src/globals/services/response.service';
import { ScheduleService } from '../services/store.schedule.service';
import { Response } from 'express';
import { CreateScheduleDTO, RequiredIdDateParam } from '../dto/store.schedule.dto';
import { CanUserAccessModelRowId } from 'src/decorators/api/CanUserAccessModelRowId.decorator';
import { ScheduleHelpersService } from '../services/store.schedule.helper.service';
import { AttachStoreId } from 'src/decorators/api/attachStoreIdInterceptor.decorator';
import { ApiRequiredIdParam } from 'src/decorators/api/id-params.decorator';
import { RequiredIdParam } from 'src/dtos/params/id-param.dto';
import { Auth } from 'src/_modules/authentication/decorators/auth.decorator';
import { GlobalHelpers } from 'src/globals/services/globalHelpers.service';

const prefix = 'schedule';

@Controller(prefix)
@ApiTags(tag(prefix))
@Auth({ prefix })
export class StoreScheduleController {
  constructor(
    private readonly service: ScheduleService,
    private readonly response: ResponseService,
    private readonly helpers: ScheduleHelpersService,
    private readonly globalHelpers: GlobalHelpers,
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
            @Get('/:id/:date')
    @ApiRequiredIdParam('id')
   @ApiParam({
    name:'date',
    type:Date,
    required:true,
   })
     async getServiceSchedule(@Res() res: Response, @Param() { id,date }: RequiredIdDateParam) {
    const schedule = await this.globalHelpers.getServiceSchedule(id,date);
   return this.response.success(res, 'store schedule returned successfully', schedule);
    }
                @Get('/:id')
    @ApiRequiredIdParam('id')

     async getStoreSchedule(@Res() res: Response, @Param() { id }: RequiredIdParam) {
    const schedule = await this.globalHelpers.getStoreSchedule(id);
   return this.response.success(res, 'store schedule returned successfully', schedule);
    }
}
