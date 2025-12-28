import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
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
  }

  async getPresignedUrl(filename: string, filetype: string, folder = 'uploads') {
    const uniqueKey = `${folder}/${uuidv4()}-${filename}`;
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
  }

  async verifyUpload(key: string) {
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
      // If the object does not exist or other error
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
