import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ unique: true })
  username?: string;

  @Prop({ default: '' })
  bio?: string;

  @Prop({ default: '' })
  avatarUrl?: string;

  @Prop({ default: '' })
  avatarPublicId?: string;

  @Prop({ default: () => new Date() })
  joined: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  followers: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  following: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Post' }], default: [] })
  bookmarkedPosts: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
