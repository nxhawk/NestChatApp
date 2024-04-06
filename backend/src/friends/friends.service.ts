import { Injectable } from '@nestjs/common';
import { IFriendsService } from './friends';
import { Friend } from 'src/utils/typeorm';
import { DeleteFriendRequestParams } from 'src/utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsService implements IFriendsService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendsRepository: Repository<Friend>,
  ) {}

  getFriends(id: number): Promise<Friend[]> {
    throw new Error('Method not implemented.');
  }

  findFriendById(id: number): Promise<Friend> {
    throw new Error('Method not implemented.');
  }

  deleteFriend(params: DeleteFriendRequestParams) {
    throw new Error('Method not implemented.');
  }

  isFriends(userOneId: number, userTwoId: number): Promise<Friend> {
    throw new Error('Method not implemented.');
  }
}
