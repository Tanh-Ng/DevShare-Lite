import { Controller, Get, Post as HttpPost, Body, Param, Patch } from '@nestjs/common';
import { PostsService } from '../services/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @HttpPost()
  createPost(@Body() body: { title: string; content: string; authorId: string; coverImage?: string; }) {
    return this.postsService.createPost(body.title, body.content, body.authorId, body.coverImage,);
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
