//controllers/posts.controller.ts
import { Controller, Get, Post as HttpPost, Body, Param, Delete } from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { Post } from '../schema/post.schema';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findById(id);
  }

  @HttpPost()
  create(@Body() body: Partial<Post>) {
    return this.postsService.create(body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.postsService.delete(id);
  }
}