import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    const existing = await this.usersService.findByEmail(body.email);
    if (existing) {
      return { message: 'Email already exists' };
    }

    const user = await this.usersService.create(body.email, body.password);
    return {
      message: 'Đăng ký thành công',
      user: {
        id: user._id,
        email: user.email
      }
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
      email: user.email
    };
  }
}
