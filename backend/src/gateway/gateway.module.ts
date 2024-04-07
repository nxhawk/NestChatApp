import { Module } from '@nestjs/common';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { FriendsModule } from 'src/friends/friends.module';
import { GroupsModule } from 'src/groups/groups.module';
import { MessagingGateway } from './gateway';

@Module({
  imports: [ConversationsModule, GroupsModule, FriendsModule],
  providers: [MessagingGateway],
  exports: [MessagingGateway],
})
export class GatewayModule {}
