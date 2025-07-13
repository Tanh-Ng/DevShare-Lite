import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../schemas/post.schema';
import { PostsService } from '../services/posts.service';
import { PostsController } from '../controllers/posts.controller';
import { User, UserSchema } from '../schemas/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema },
    { name: User.name, schema: UserSchema },]),
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule { }
