import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './modules/post.module';
import { UsersModule } from 'modules/user.module';
import { AuthModule } from 'modules/auth.module';
import { CloudinaryModule } from './modules/cloudinary.module';
import { UploadController } from './controllers/upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { CommentsModule } from './modules/comment.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    MulterModule.register(),
    PostsModule,
    UsersModule,
    AuthModule,
    CommentsModule,
    CloudinaryModule
  ],
  controllers: [AppController, UploadController],
  providers: [AppService],
})
export class AppModule { }
