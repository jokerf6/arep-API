import { Controller, Delete, Get, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseService } from 'src/globals/services/response.service';
import { AppService } from './app.service';
import { Response } from 'express';
@Controller()
export class AppController {
  constructor(
    private readonly response: ResponseService,
    private readonly service: AppService,
  ) {}

  @Get('/debug-sentry')
  getError() {
    throw new Error('My first Sentry error!');
  }
}
