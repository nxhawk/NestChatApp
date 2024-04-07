import { Module } from '@nestjs/common';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { FriendsModule } from 'src/friends/friends.module';
import { GroupsModule } from 'src/groups/groups.module';
import { MessagingGateway } from './gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from 'src/utils/typeorm';

@Module({
  imports: [
    ConversationsModule,
    GroupsModule,
    FriendsModule,
    TypeOrmModule.forFeature([Session]),
  ],
  providers: [MessagingGateway],
  exports: [MessagingGateway],
})
export class GatewayModule {}
