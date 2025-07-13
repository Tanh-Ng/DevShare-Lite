import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../schemas/post.schema';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,) { }

  async createPost(title: string, content: string, authorId: string, coverImage?: string) {
    return this.postModel.create({
      title,
      content,
      author: new Types.ObjectId(authorId),
      coverImage

    });
  }

  async searchPostsByTitle(query: string) {
    if (!query) return [];

    return this.postModel
      .find({ title: { $regex: query, $options: 'i' } })
      .populate('author', 'username')
      .select('title _id author')
      .limit(5);
  }

  async getAllPosts() {
    return this.postModel.find().populate('author', 'username avatarUrl');
  }

  async getPostById(id: string) {
    return this.postModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'username avatarUrl');
  }

  async getPostsByAuthor(authorId: string) {
    return this.postModel
      .find({ author: new Types.ObjectId(authorId) })
      .populate('author', 'username avatarUrl')
      .sort({ createdAt: -1 });
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

  async updateCoverImage(postId: string, coverImage: string, coverImagePublicId?: string) {
    return this.postModel.findByIdAndUpdate(
      postId,
      { coverImage, coverImagePublicId },
      { new: true }
    );
  }

  async updatePost(
    postId: string,
    userId: string,
    title?: string,
    content?: string,
    coverImage?: string,
  ) {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại');
    }

    if (post.author.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền sửa bài viết này');
    }

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (coverImage !== undefined) post.coverImage = coverImage;

    return await post.save();
  }

  async getPostsFromFollowing(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.postModel
      .find({ author: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate('author');
  }

  async getLatestPosts() {
    return this.postModel.find().sort({ createdAt: -1 }).populate('author');
  }


}
