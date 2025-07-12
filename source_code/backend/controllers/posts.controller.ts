import { Controller, Get, Post as HttpPost, Body, Param, Patch, Req, UseGuards, Query } from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { JwtAuthGuard } from '../strategies/jwt-auth.guard';
import { Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @UseGuards(JwtAuthGuard)
  @HttpPost()
  async createPost(
    @Req() req: Request,
    @Body() body: { title: string; content: string; coverImage?: string }
  ) {
    const user = req.user as any;
    return this.postsService.createPost(body.title, body.content, user.userId, body.coverImage);
  }

  @Get('search')
  async searchPosts(@Query('q') query: string) {
    return this.postsService.searchPostsByTitle(query);
  }
  
  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Patch(':id/like')
  like(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.postsService.toggleLike(id, body.userId);
  }

  @Patch(':id/bookmark')
  bookmark(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.postsService.toggleBookmark(id, body.userId);
  }

  @Patch(':id/cover')
  async updateCoverImage(
    @Param('id') id: string,
    @Body() body: { coverImage: string; coverImagePublicId?: string }
  ) {
    return this.postsService.updateCoverImage(id, body.coverImage, body.coverImagePublicId);
  }
}
