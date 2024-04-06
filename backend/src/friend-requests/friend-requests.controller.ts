import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { CreateFriendDto } from './dtos/CreateFriend.dto';
import { Throttle } from '@nestjs/throttler';
import { IFriendRequestService } from './friend-requests';
import { AuthenticatedGuard } from 'src/auth/utils/Guards';

@UseGuards(AuthenticatedGuard)
@Controller(Routes.FRIEND_REQUESTS)
export class FriendRequestsController {
  constructor(
    @Inject(Services.FRIENDS_REQUESTS_SERVICE)
    private readonly friendRequestService: IFriendRequestService,
  ) {}

  @Get()
  getFriendRequests(@AuthUser() user: User) {
    return this.friendRequestService.getFriendRequests(user.id);
  }

  @Throttle({ default: { limit: 3, ttl: 10 } })
  @Post()
  async createFriendRequest(
    @AuthUser() user: User,
    @Body() { username }: CreateFriendDto,
  ) {
    const params = { user, username };
    console.log(params);
    const friendRequest = await this.friendRequestService.create(params);
    return friendRequest;
  }
}
