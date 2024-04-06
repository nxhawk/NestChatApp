import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IMessageService } from './messages';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { EmptyMessageException } from './exceptions/EmptyMessage';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Attachment } from 'src/utils/types';
import { EditMessageDto } from './dtos/EditMessage.dto';

@Controller(Routes.MESSAGES)
export class MessagesController {
  constructor(
    @Inject(Services.MESSAGES) private readonly messageService: IMessageService,
  ) {}

  @Throttle({ default: { limit: 5, ttl: 10 } })
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'attachments',
        maxCount: 5,
      },
    ]),
  )
  @Post()
  async createMessage(
    @AuthUser() user: User,
    @UploadedFiles() { attachments }: { attachments: Attachment[] },
    @Param('id', ParseIntPipe) id: number,
    @Body()
    { content }: CreateMessageDto,
  ) {
    if (!content) throw new EmptyMessageException();
    const params = { user, id, content, attachments };
    const response = await this.messageService.createMessage(params);
    // socket here
    return response;
  }

  @Get()
  @SkipThrottle()
  async getMessagesFromConversation(@Param('id', ParseIntPipe) id: number) {
    const messages = await this.messageService.getMessages(id);
    return { id, messages };
  }

  @Delete(':messageId')
  async deleteMessageFromConversation(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) conversationId: number,
    @Param('messageId', ParseIntPipe) messageId: number,
  ) {
    const params = { userId: user.id, conversationId, messageId };
    await this.messageService.deleteMessage(params);
    // socket here
    return { conversationId, messageId };
  }

  @Patch(':messageId')
  async editMessage(
    @AuthUser() { id: userId }: User,
    @Param('id') conversationId: number,
    @Param('messageId') messageId: number,
    @Body() { content }: EditMessageDto,
  ) {
    const params = { userId, content, conversationId, messageId };
    const message = await this.messageService.editMessage(params);
    // socket here
    return message;
  }
}
