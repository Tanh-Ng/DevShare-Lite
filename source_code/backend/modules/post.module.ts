import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../schemas/post.schema';
import { PostsService } from '../services/posts.service';
import { PostsController } from '../controllers/posts.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule { }
