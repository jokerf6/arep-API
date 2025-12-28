import { Body, Controller, Post, Res, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Auth } from 'src/_modules/authentication/decorators/auth.decorator';
import { ResponseService } from 'src/globals/services/response.service';
import { tag } from 'src/globals/helpers/tag.helper';
import { UploadService } from './upload.service';

const prefix = 'upload';

@Controller(prefix)
@ApiTags(tag(prefix))
@Auth()
export class UploadController {
  constructor(
    private service: UploadService,
    private response: ResponseService,
  ) {}

  @Post('/presigned-url')
  async getPresignedUrl(@Body() body: { filename: string; filetype: string; folder?: string }, @Res() res: Response) {
    if (!body.filename || !body.filetype) {
      throw new BadRequestException('Filename and filetype are required');
    }

    const data = await this.service.getPresignedUrl(body.filename, body.filetype, body.folder);
    
    return this.response.success(
      res,
      'Presigned URL generated successfully',
      data
    );
  }

  @Post('/verify')
  async verifyUpload(@Body() body: { key: string }, @Res() res: Response) {
    if (!body.key) {
      throw new BadRequestException('Key is required');
    }

    const result = await this.service.verifyUpload(body.key);
    
    if (!result.success) {
      throw new BadRequestException(`Verification failed: ${result.error}`);
    }

    return this.response.success(
      res,
      'Upload verified successfully',
      result.metadata
    );
  }
}
