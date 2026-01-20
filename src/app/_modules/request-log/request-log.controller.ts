import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { join } from 'path';
import { Filter } from 'src/decorators/param/filter.decorator';
import { ResponseService } from 'src/globals/services/response.service';
import { Auth } from 'src/_modules/authentication/decorators/auth.decorator';
import { FilterRequestLogDTO } from './dto/filter-request-log.dto';
import { RequestLogService } from './request-log.service';

@ApiTags('Request Logs')
@Controller('request-logs')
export class RequestLogController {
  constructor(
    private readonly requestLogService: RequestLogService,
    private readonly response: ResponseService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get request logs dashboard' })
  async getDashboard(@Res() res: Response) {
    const filePath = join(process.cwd(), 'dist/src/public/request-logs.html');
    if (!require('fs').existsSync(filePath)) {
         // Fallback for when running with ts-node/dev directly without build
        return res.sendFile(join(process.cwd(), 'src/public/request-logs.html'));
    }
    return res.sendFile(filePath);
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Get list of request logs' })
      async findAll(@Res() res: Response, @Filter({ dto: FilterRequestLogDTO }) filters: FilterRequestLogDTO) {
    const result = await this.requestLogService.findAll(filters);
    return this.response.success(res, 'Request logs retrieved successfully', result.data, {
      total: result.total,
    });
  }

  @Get(':id')
  @Auth()
  @ApiOperation({ summary: 'Get detailed request log' })
  async findOne(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    const data = await this.requestLogService.findOne(id);
    return this.response.success(res, 'Request log details', data);
  }
}
