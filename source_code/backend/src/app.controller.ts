import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('posts')
  getPosts() {
    return [
      {
        id: 1,
        title: 'My First Blog Post',
        content: 'This is the content of my first blog post',
        author: 'John Doe',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Learning NestJS',
        content: 'NestJS is a powerful Node.js framework',
        author: 'Jane Smith',
        createdAt: new Date().toISOString(),
      }
    ];
  }
}