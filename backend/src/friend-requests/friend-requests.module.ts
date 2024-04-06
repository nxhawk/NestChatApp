import { Module } from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import { FriendRequestsController } from './friend-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend, FriendRequest } from 'src/utils/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Services } from 'src/utils/constants';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendRequest, Friend]),
    UsersModule,
    FriendsModule,
  ],
  controllers: [FriendRequestsController],
  providers: [
    {
      provide: Services.FRIENDS_REQUESTS_SERVICE,
      useClass: FriendRequestsService,
    },
  ],
})
export class FriendRequestsModule {}
