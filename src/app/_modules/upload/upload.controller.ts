import { Body, Controller, Post, Res, BadRequestException, Put, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { Auth } from 'src/_modules/authentication/decorators/auth.decorator';
import { ResponseService } from 'src/globals/services/response.service';
import { tag } from 'src/globals/helpers/tag.helper';
import { UploadService } from './upload.service';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

const prefix = 'upload';

@Controller(prefix)
@ApiTags(tag(prefix))
@Auth()
export class UploadController {
  private uploadsPath: string;

  constructor(
    private service: UploadService,
    private response: ResponseService,
    private configService: ConfigService,
  ) {
    this.uploadsPath = this.configService.get('UPLOADS_PATH') || './uploads';
  }

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

  @Put('/local-upload/:folder/:filename')
  async localUpload(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const filePath = path.join(this.uploadsPath, folder, filename);
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const writeStream = fs.createWriteStream(filePath);
    
    req.pipe(writeStream);

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        resolve(this.response.success(res, 'File uploaded successfully', { key: `${folder}/${filename}` }));
      });
      writeStream.on('error', (err) => {
        reject(new BadRequestException(`Upload failed: ${err.message}`));
      });
    });
  }
}
