import { Body, Controller, Inject, Param, ParseIntPipe, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IGroupMessageService } from '../interfaces/group-messages';
import { Throttle } from '@nestjs/throttler';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { Attachment } from 'src/utils/types';
import { CreateMessageDto } from 'src/messages/dtos/CreateMessage.dto';
import { EmptyMessageException } from 'src/messages/exceptions/EmptyMessage';

@Controller(Routes.GROUP_MESSAGES)
export class GroupMessageController {
  constructor(
    @Inject(Services.GROUP_MESSAGES)
    private readonly groupMessageService: IGroupMessageService,
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
  async createGroupMessage(
    @AuthUser() user: User,
    @UploadedFiles() { attachments }: { attachments: Attachment[] },
    @Param('id', ParseIntPipe) id: number,
    @Body() { content }: CreateMessageDto,
  ) {
    if (!attachments && !content) throw new EmptyMessageException();
    const params = { groupId: id, author: user, content, attachments };
    const response = await this.groupMessageService.createGroupMessage(params);
    // socket here
    return response;
  }
}
