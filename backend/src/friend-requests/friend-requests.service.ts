import { Inject, Injectable } from '@nestjs/common';
import { IFriendRequestService } from './friend-requests';
import {
  AcceptFriendRequestResponse,
  CancelFriendRequestParams,
  CreateFriendParams,
  FriendRequestParams,
} from 'src/utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend, FriendRequest } from 'src/utils/typeorm';
import { Repository } from 'typeorm';
import { IUserService } from 'src/users/interfaces/user';
import { Services } from 'src/utils/constants';
import { UserNotFoundException } from 'src/users/exceptions/UserNotFound';
import { FriendRequestPending } from './exceptions/FriendRequestPending';
import { FriendRequestException } from './exceptions/FriendRequest';
import { FriendRequestNotFoundException } from './exceptions/FriendRequestNotFound';
import { FriendRequestAcceptedException } from './exceptions/FriendRequestAccepted';
import { IFriendsService } from 'src/friends/friends';

@Injectable()
export class FriendRequestsService implements IFriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @Inject(Services.USERS)
    private readonly userService: IUserService,
    @Inject(Services.FRIENDS_SERVICE)
    private readonly friendsService: IFriendsService,
  ) {}

  getFriendRequests(id: number): Promise<FriendRequest[]> {
    const status = 'pending';
    return this.friendRequestRepository.find({
      where: [
        { sender: { id }, status },
        { receiver: { id }, status },
      ],
      relations: ['receiver', 'sender', 'receiver.profile', 'sender.profile'],
    });
  }

  async create({ user: sender, username }: CreateFriendParams) {
    const receiver = await this.userService.findUser({ username });
    if (!receiver) throw new UserNotFoundException();
    const exists = await this.isPending(sender.id, receiver.id);
    if (exists) throw new FriendRequestPending();
    if (receiver.id === sender.id)
      throw new FriendRequestException('Cannot Add Yourself');

    // TODO: check current friend
    const friend = this.friendRequestRepository.create({
      sender,
      receiver,
      status: 'pending',
    });
    return this.friendRequestRepository.save(friend);
  }

  async accept({
    id,
    userId,
  }: FriendRequestParams): Promise<AcceptFriendRequestResponse> {
    const friendRequest = await this.findById(id);
    if (!friendRequest) throw new FriendRequestNotFoundException();
    if (friendRequest.status === 'accepted')
      throw new FriendRequestAcceptedException();
    if (friendRequest.receiver.id !== userId)
      throw new FriendRequestException();
    friendRequest.status = 'accepted';
    const updatedFriendRequest =
      await this.friendRequestRepository.save(friendRequest);
    const newFriend = await this.friendRepository.create({
      sender: friendRequest.sender,
      receiver: friendRequest.receiver,
    });
    const friend = await this.friendRepository.save(newFriend);
    return { friend, friendRequest: updatedFriendRequest };
  }

  async cancel({ id, userId }: CancelFriendRequestParams) {
    const friendRequest = await this.findById(id);
    if (!friendRequest) throw new FriendRequestNotFoundException();
    if (friendRequest.sender.id !== userId) throw new FriendRequestException();
    await this.friendRequestRepository.delete(id);
    return friendRequest;
  }

  async reject({ id, userId }: CancelFriendRequestParams) {
    const friendRequest = await this.findById(id);
    if (!friendRequest) throw new FriendRequestNotFoundException();
    if (friendRequest.status === 'accepted')
      throw new FriendRequestAcceptedException();
    if (friendRequest.receiver.id !== userId)
      throw new FriendRequestException();
    friendRequest.status = 'rejected';
    return this.friendRequestRepository.save(friendRequest);
  }

  isPending(userOneId: number, userTwoId: number) {
    return this.friendRequestRepository.findOne({
      where: [
        {
          sender: { id: userOneId },
          receiver: { id: userTwoId },
          status: 'pending',
        },
        {
          sender: { id: userTwoId },
          receiver: { id: userOneId },
          status: 'pending',
        },
      ],
    });
  }

  findById(id: number): Promise<FriendRequest> {
    return this.friendRequestRepository.findOne({
      where: { id },
      relations: ['receiver', 'sender'],
    });
  }
}
