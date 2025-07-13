// schemas/comment.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
    post: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    author: Types.ObjectId;

    @Prop({ required: true })
    content: string;

    @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
    parentComment?: Types.ObjectId;
}

export type CommentDocument = Comment & Document & { _id: Types.ObjectId };

export const CommentSchema = SchemaFactory.createForClass(Comment);
