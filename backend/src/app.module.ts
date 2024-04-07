import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import { FriendRequestsModule } from './friend-requests/friend-requests.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerBehindProxyGuard } from './utils/throttler';
import { FriendsModule } from './friends/friends.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { MessageAttachmentsModule } from './message-attachments/message-attachments.module';
import { GroupsModule } from './groups/groups.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GatewayModule } from './gateway/gateway.module';
import { dataSourceOptions } from 'db/data-source';

const envFilePath = '.env.dev';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    PassportModule.register({ session: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    GatewayModule,
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    FriendRequestsModule,
    ThrottlerModule.forRoot([
      {
        ttl: 10,
        limit: 10,
      },
    ]),
    FriendsModule,
    ConversationsModule,
    MessagesModule,
    MessageAttachmentsModule,
    GroupsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
