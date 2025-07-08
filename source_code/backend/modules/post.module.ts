//modules/posts.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from '../controllers/posts.controller';
import { PostsService } from '../services/posts.service';
import { Post, PostSchema } from '../schema/post.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule { }
