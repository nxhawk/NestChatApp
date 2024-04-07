import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import entities from './utils/typeorm';
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

const envFilePath = '.env.dev';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath }),
    PassportModule.register({ session: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities,
      logging: false,
      synchronize: true,
    }),
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
