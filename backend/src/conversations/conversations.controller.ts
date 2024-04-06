import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthenticatedGuard } from 'src/auth/utils/Guards';
import { Routes, Services } from 'src/utils/constants';
import { IConversationsService } from './conversations';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { CreateConversationDto } from './dtos/CreateConversation.dto';

@SkipThrottle()
@UseGuards(AuthenticatedGuard)
@Controller(Routes.CONVERSATIONS)
export class ConversationsController {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationsService,
  ) {}

  @Post()
  async createConversation(
    @AuthUser() user: User,
    @Body() createConversationPayload: CreateConversationDto,
  ) {
    const conversation = await this.conversationService.createConversation(
      user,
      createConversationPayload,
    );
    // socket here
    return conversation;
  }
}
