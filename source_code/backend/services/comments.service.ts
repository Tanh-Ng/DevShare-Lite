// services/comments.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from '../schemas/comment.schema';
import { Post } from '../schemas/post.schema';

interface NestedComment {
    _id: Types.ObjectId;
    post: Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    parentComment?: Types.ObjectId | null;
    author: {
        _id: Types.ObjectId;
        username: string;
        avatarUrl?: string;
    };
    replies: NestedComment[];
}
@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name)
        private commentModel: Model<CommentDocument>,
        @InjectModel(Post.name)
        private postModel: Model<Post>,
    ) { }

    async createComment(
        postId: string,
        userId: string,
        content: string,
        parentCommentId?: string,
    ) {
        const post = await this.postModel.findById(postId);
        if (!post) throw new NotFoundException('Bài viết không tồn tại');


        const newComment = await this.commentModel.create({
            post: new Types.ObjectId(postId),
            author: new Types.ObjectId(userId),
            content,
            parentComment: parentCommentId ? new Types.ObjectId(parentCommentId) : null,
        });

        if (!parentCommentId) {
            await this.postModel.findByIdAndUpdate(postId, {
                $push: { comments: newComment._id },
            });
        }

        return newComment;
    }


    async getCommentsByPost(postId: string): Promise<NestedComment[]> {
        console.log('Fetching comments for postId:', postId);

        const comments = await this.commentModel
            .find({ post: new Types.ObjectId(postId) })
            .populate('author', 'username avatarUrl')
            .sort({ createdAt: 1 });

        console.log(`Found ${comments.length} comments`);

        const commentMap = new Map<string, NestedComment>();
        const roots: NestedComment[] = [];

        comments.forEach((comment) => {
            const c = comment.toObject() as any;
            commentMap.set(c._id.toString(), { ...c, replies: [] });
        });

        commentMap.forEach((comment) => {
            if (comment.parentComment) {
                const parent = commentMap.get(comment.parentComment.toString());
                if (parent) {
                    parent.replies.push(comment);
                }
            } else {
                roots.push(comment);
            }
        });

        return roots;
    }

    // Sửa comment
    async updateComment(commentId: string, userId: string, content: string) {
        const comment = await this.commentModel.findById(commentId);

        if (!comment) throw new NotFoundException('Không tìm thấy comment');
        if (comment.author.toString() !== userId) throw new ForbiddenException('Không có quyền sửa');

        comment.content = content;
        await comment.save();
        return comment;
    }

    // Xoá comment
    async deleteComment(commentId: string, userId: string) {
        const comment = await this.commentModel.findById(commentId);

        if (!comment) throw new NotFoundException('Không tìm thấy comment');
        if (comment.author.toString() !== userId) throw new ForbiddenException('Không có quyền xóa');

        await this.commentModel.deleteOne({ _id: commentId });
        return { message: 'Đã xoá bình luận' };
    }
}
