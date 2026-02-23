import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private s3Client: S3Client;
  private bucketName: string;
  private isAwsEnabled: boolean;
  private uploadsPath: string;
  private mainUrl: string;

  constructor(private configService: ConfigService) {
    this.isAwsEnabled = this.configService.get('AWS_MEDIA') === 'true' || this.configService.get('AWS_MEDIA') === true;
    this.uploadsPath = this.configService.get('UPLOADS_PATH') || './uploads';
    this.mainUrl = this.configService.get('MAIN_URL') || 'http://localhost:3030';

    if (this.isAwsEnabled) {
      const region = this.configService.getOrThrow('AWS_REGION') || 'us-east-1';
      const accessKeyId = this.configService.getOrThrow('AWS_ACCESS_KEY_ID') || 'AKIAIOSFODNN7EXAMPLE';
      const secretAccessKey = this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY') || 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';
      this.bucketName = this.configService.getOrThrow('AWS_S3_BUCKET_NAME') || 'my-bucket';

      this.s3Client = new S3Client({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    } else {
      // Ensure local uploads directory exists
      if (!fs.existsSync(this.uploadsPath)) {
        fs.mkdirSync(this.uploadsPath, { recursive: true });
      }
    }
  }

  async getPresignedUrl(filename: string, filetype: string, folder = 'uploads') {
    const uniqueKey = `${folder}/${uuidv4()}-${filename}`;

    if (this.isAwsEnabled) {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: uniqueKey,
        ContentType: filetype,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // 1 hour expiration

      return {
        url,
        key: uniqueKey,
      };
    } else {
      // For local upload, we return a URL pointing to our own upload endpoint
      // Using the same response structure as AWS
      const url = `${this.mainUrl}/api/upload/local-upload/${uniqueKey}`;

      return {
        url,
        key: uniqueKey,
      };
    }
  }

  async verifyUpload(key: string) {
    if (this.isAwsEnabled) {
      try {
        const command = new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        });

        const result = await this.s3Client.send(command);

        return {
          success: true,
          metadata: {
            size: result.ContentLength,
            type: result.ContentType,
            lastModified: result.LastModified,
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
        };
      }
    } else {
      try {
        const filePath = path.join(this.uploadsPath, key);

        if (!fs.existsSync(filePath)) {
          return {
            success: false,
            error: 'File does not exist',
          };
        }

        const stats = fs.statSync(filePath);

        return {
          success: true,
          metadata: {
            size: stats.size,
            type: this.getMimeType(filePath),
            lastModified: stats.mtime,
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
        };
      }
    }
  }

  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimetypes: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
    };
    return mimetypes[ext] || 'application/octet-stream';
  }
}
