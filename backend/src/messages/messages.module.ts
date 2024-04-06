import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation, Message } from 'src/utils/typeorm';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { FriendsModule } from 'src/friends/friends.module';
import { Services } from 'src/utils/constants';
import { MessageAttachmentsModule } from 'src/message-attachments/message-attachments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Conversation]),
    ConversationsModule,
    FriendsModule,
    MessageAttachmentsModule,
  ],
  controllers: [MessagesController],
  providers: [
    {
      provide: Services.MESSAGES,
      useClass: MessagesService,
    },
  ],
})
export class MessagesModule {}
