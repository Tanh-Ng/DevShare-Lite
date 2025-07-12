import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  username?: string;

  @Prop({ default: '' })
  bio?: string;

  @Prop({ default: '' })
  avatarUrl?: string;

  @Prop({ default: '' })
  avatarPublicId?: string;

  @Prop({ default: () => new Date() })
  joined: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
