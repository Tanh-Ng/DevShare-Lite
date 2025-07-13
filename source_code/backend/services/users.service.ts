import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async create(email: string, password: string, username?: string): Promise<UserDocument> {
    const hashed = await bcrypt.hash(password, 10);
    const user = new this.userModel({ email, password: hashed, username });
    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-password');
  }

  async updateBio(userId: string, bio: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { bio },
      { new: true }
    );
  }
  async updateAvatar(
    userId: string,
    avatarUrl: string,
    avatarPublicId: string
  ): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { avatarUrl, avatarPublicId },
      { new: true }
    );
  }
  async searchUsersByUsernameOrEmail(query: string): Promise<User[]> {
    const regex = new RegExp(query, 'i');
    return this.userModel.find({
      $or: [
        { username: { $regex: regex } },
        { email: { $regex: regex } },
      ],
    }).select('_id username email avatarUrl');
  }
}
