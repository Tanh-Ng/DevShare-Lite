// comments.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from '../controllers/comments.controller';
import { CommentsService } from '../services/comments.service';
import { Comment, CommentSchema } from '../schemas/comment.schema';
import { Post, PostSchema } from '../schemas/post.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Comment.name, schema: CommentSchema },
            { name: Post.name, schema: PostSchema },
        ]),
    ],
    controllers: [CommentsController],
    providers: [CommentsService],
})
export class CommentsModule { }
