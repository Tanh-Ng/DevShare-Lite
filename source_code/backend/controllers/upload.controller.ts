import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Inject,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { Express } from 'express';
import { Readable } from 'stream';

@Controller('upload')
export class UploadController {
  constructor(@Inject('CLOUDINARY') private cloud: typeof cloudinary) {}
  @Post('blogcover')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBlogCover(
    @UploadedFile() file: Express.Multer.File,
    @Body('oldPublicId') oldPublicId?: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    if (oldPublicId) {
      await this.cloud.uploader.destroy(oldPublicId);
    }

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = this.cloud.uploader.upload_stream(
        { folder: 'blog_covers' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body('oldPublicId') oldPublicId?: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    if (oldPublicId) {
      await this.cloud.uploader.destroy(oldPublicId);
    }

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = this.cloud.uploader.upload_stream(
        {
          folder: 'avatars',
          width: 256,
          height: 256,
          crop: 'fill',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }
}
