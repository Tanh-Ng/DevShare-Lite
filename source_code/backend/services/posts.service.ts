import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../schemas/post.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) { }

  async createPost(title: string, content: string, authorId: string, coverImage?: string) {
    return this.postModel.create({
      title,
      content,
      author: new Types.ObjectId(authorId),
      coverImage

    });
  }

  async getAllPosts() {
    return this.postModel.find().populate('author').exec();
  }

  async getPostById(id: string) {
    return this.postModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author');
  }


  async toggleLike(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    const uid = new Types.ObjectId(userId);
    const index = post.likes.findIndex((u) => u.equals(uid));

    if (index >= 0) post.likes.splice(index, 1);
    else post.likes.push(uid);

    return post.save();
  }

  async toggleBookmark(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    const uid = new Types.ObjectId(userId);
    const index = post.bookmarks.findIndex((u) => u.equals(uid));

    if (index >= 0) post.bookmarks.splice(index, 1);
    else post.bookmarks.push(uid);

    return post.save();
  }

}
