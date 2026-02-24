import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Filter } from 'src/decorators/param/filter.decorator';
import { AuditService } from 'src/globals/services/audit.service';
import { ResponseService } from 'src/globals/services/response.service';
import { FilterAuditDTO } from './dto/filter.audit.dto';

@ApiTags('Audit')
@Controller('audit')
export class AuditController {
  constructor(
    private readonly auditService: AuditService,
    private readonly response: ResponseService,
  ) {}

  @Get('entities')
  @ApiOperation({ summary: 'Get list of tracked entities' })
  async getEntities(@Res() res: Response) {
    const data = this.auditService.getTrackedEntities();
    return this.response.success(res, 'get audit entities', data);
  }

  @Get('/')
  @ApiQuery({ type: FilterAuditDTO })
  @ApiOperation({ summary: 'Get audit history for an entity' })
  async getHistory(
    @Res() res: Response,
    @Filter({ dto: FilterAuditDTO }) filters: FilterAuditDTO,
  ) {
    const { data, total } = await this.auditService.getHistory(filters);
    return this.response.success(res, 'get audit history', data, { total });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific audit log entry' })
  async getLog(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    const data = await this.auditService.getLog(id);
    return this.response.success(res, 'get audit log', data);
  }
}
