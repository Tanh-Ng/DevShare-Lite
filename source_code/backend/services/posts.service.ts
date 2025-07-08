//services/posts.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../schema/post.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) { }

  async create(data: Partial<Post>) {
    return new this.postModel(data).save();
  }

  async findAll() {
    return this.postModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string) {
    return this.postModel.findById(id);
  }

  async delete(id: string) {
    return this.postModel.findByIdAndDelete(id);
  }
}