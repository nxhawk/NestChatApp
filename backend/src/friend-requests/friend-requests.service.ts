import { Inject, Injectable } from '@nestjs/common';
import { IFriendRequestService } from './friend-requests';
import { CreateFriendParams } from 'src/utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from 'src/utils/typeorm';
import { Repository } from 'typeorm';
import { IUserService } from 'src/users/interfaces/user';
import { Services } from 'src/utils/constants';
import { UserNotFoundException } from 'src/users/exceptions/UserNotFound';
import { FriendRequestPending } from './exceptions/FriendRequestPending';
import { FriendRequestException } from './exceptions/FriendRequest';

@Injectable()
export class FriendRequestsService implements IFriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    @Inject(Services.USERS)
    private readonly userService: IUserService,
  ) {}

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
}
