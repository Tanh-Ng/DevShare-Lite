import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { Express } from 'express';

@Controller('upload')
export class UploadController {
  constructor(@Inject('CLOUDINARY') private cloud: typeof cloudinary) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloud.uploader.upload(file.path, {
      folder: 'blog_covers',
    });
    return { url: result.secure_url };
  }
}
