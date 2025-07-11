import { Body, Controller, Get, Param, UseGuards, Req, Post, Put, Patch } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../strategies/jwt-auth.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Post('register')
  async register(@Body() body: { email: string; password: string; username?: string }) {
    const existing = await this.usersService.findByEmail(body.email);
    if (existing) {
      return { message: 'Email đã tồn tại' };
    }

    try {
      const user = await this.usersService.create(body.email, body.password, body.username);
      return {
        message: 'Đăng ký thành công',
        user: {
          id: user._id,
          email: user.email,
          username: user.username ?? '',
        },
      };
    } catch (err: any) {
      if (err.code === 11000 && err.keyPattern?.username) {
        return { message: 'Username đã tồn tại' };
      }
      return { message: 'Đăng ký thất bại. Vui lòng thử lại.' };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request) {
    const user = req.user as any;
    const found = await this.usersService.findById(user.userId);

    if (!found) {
      return { message: 'User not found' };
    }

    return {
      id: found._id,
      email: found.email,
      username: found.username || '',
      bio: found.bio || '',
      avatarUrl: found.avatarUrl || '',
      avatarPublicId: found.avatarPublicId || '',
      joined: found.joined
    };
  }

  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) return { message: 'User not found' };
    return {
      id: user._id,
      email: user.email,
      username: user.username,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Put('me/bio')
  async updateBio(@Req() req, @Body() body: { bio: string }) {
    const updated = await this.usersService.updateBio(req.user.userId, body.bio);
    if (!updated) {
      return { message: 'User not found or bio update failed' };
    }
    return {
      message: 'Cập nhật bio thành công',
      bio: updated.bio,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Patch('me/avatar')
  updateAvatar(
    @Req() req: Request,
    @Body() body: { avatarUrl: string; avatarPublicId: string }
  ) {
    const user = req.user as any;
    return this.usersService.updateAvatar(user.userId, body.avatarUrl, body.avatarPublicId);
  }

}
