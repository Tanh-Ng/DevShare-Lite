// controllers/comments.controller.ts
import {
    Controller,
    Post,
    Body,
    Param,
    Req,
    Get,
    UseGuards,
    Patch,
    Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../strategies/jwt-auth.guard';
import { CommentsService } from '../services/comments.service';
import { Request } from 'express';

interface NestedComment {
    _id: any;
    post: any;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    parentComment?: any;
    author: {
        _id: any;
        username: string;
        avatarUrl?: string;
    };
    replies: NestedComment[];
}

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @UseGuards(JwtAuthGuard)
    @Post('/:postId')
    createComment(
        @Param('postId') postId: string,
        @Body() body: { content: string; parentCommentId?: string },
        @Req() req: Request,
    ) {
        const user = req.user as any;
        return this.commentsService.createComment(postId, user.userId, body.content, body.parentCommentId);
    }

    @Get('/post/:postId')
    getComments(@Param('postId') postId: string): Promise<NestedComment[]> {
        return this.commentsService.getCommentsByPost(postId);
    }

    @Patch('/:commentId')
    @UseGuards(JwtAuthGuard)
    updateComment(
        @Param('commentId') commentId: string,
        @Body() body: { content: string },
        @Req() req: Request
    ) {
        const user = req.user as any;
        return this.commentsService.updateComment(commentId, user.userId, body.content);
    }

    @Delete('/:commentId')
    @UseGuards(JwtAuthGuard)
    deleteComment(
        @Param('commentId') commentId: string,
        @Req() req: Request
    ) {
        const user = req.user as any;
        return this.commentsService.deleteComment(commentId, user.userId);
    }
}
