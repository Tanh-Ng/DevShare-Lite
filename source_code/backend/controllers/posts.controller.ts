import { Controller, Get, Post as HttpPost, Body, Param, Patch, Req, UseGuards, Query, Delete, ForbiddenException, NotFoundException } from '@nestjs/common';
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

  @Get('latest')
  async getLatestPosts() {
    return this.postsService.getLatestPosts();
  }

  @Get('following')
  @UseGuards(JwtAuthGuard)
  async getPostsFromFollowing(@Req() req: Request) {
    const currentUser = req.user as any;
    return this.postsService.getPostsFromFollowing(currentUser.userId);
  }
  s
  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Get('by-author/:authorId')
  async getPostsByAuthor(@Param('authorId') authorId: string) {
    return this.postsService.getPostsByAuthor(authorId);
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: { title?: string; content?: string; coverImage?: string }
  ) {
    const user = req.user as any;
    return this.postsService.updatePost(id, user.userId, body.title, body.content, body.coverImage);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/star')
  async toggleStar(@Param('id') postId: string, @Req() req) {
    const userId = req.user.userId;
    const result = await this.postsService.toggleStar(postId, userId);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;

    // Lấy bài viết
    const post = await this.postsService.getPostById(id);
    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại');
    }

    // Kiểm tra quyền: chỉ tác giả mới được xóa


    if (post.author._id.toString() !== user.userId.toString()) {
      throw new ForbiddenException('Bạn không có quyền xóa bài viết này');
    }

    // Thực hiện xóa
    return this.postsService.deletePost(id);
  }

}
