import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IGroupRecipientService } from '../interfaces/group-recipient';
import { Services } from 'src/utils/constants';
import { IUserService } from 'src/users/interfaces/user';
import { IGroupService } from '../interfaces/group';
import {
  AddGroupRecipientParams,
  AddGroupUserResponse,
  CheckUserGroupParams,
  LeaveGroupParams,
  RemoveGroupRecipientParams,
  RemoveGroupUserResponse,
} from 'src/utils/types';
import { InvalidGroupException } from '../exceptions/InvalidGroup';
import { UserNotFoundException } from 'src/users/exceptions/UserNotFound';
import { GroupNotFoundException } from '../exceptions/GroupNotFound';
import { GroupParticipantNotFound } from '../exceptions/GroupParticipantNotFound';
import { GroupOwnerTransferException } from '../exceptions/GroupOwnerTransfer';

@Injectable()
export class GroupRecipientService implements IGroupRecipientService {
  constructor(
    @Inject(Services.USERS) private userService: IUserService,
    @Inject(Services.GROUPS) private groupService: IGroupService,
  ) {}

  async addGroupRecipient(
    params: AddGroupRecipientParams,
  ): Promise<AddGroupUserResponse> {
    const group = await this.groupService.findGroupById(params.id);
    if (!group) throw new InvalidGroupException();
    if (group.owner.id !== params.userId)
      throw new HttpException('Insufficient Permissions', HttpStatus.FORBIDDEN);
    const recipient = await this.userService.findUser({
      username: params.username,
    });
    if (!recipient) throw new UserNotFoundException();
    const inGroup = group.users.find((user) => user.id === recipient.id);
    if (inGroup)
      throw new HttpException('User already in group', HttpStatus.BAD_REQUEST);
    group.users = [...group.users, recipient];
    const savedGroup = await this.groupService.saveGroup(group);
    return { group: savedGroup, user: recipient };
  }

  async isUserInGroup({ id, userId }: CheckUserGroupParams) {
    const group = await this.groupService.findGroupById(id);
    if (!group) throw new GroupNotFoundException();
    const user = group.users.find((user) => user.id === userId);
    if (!user) throw new GroupParticipantNotFound();
    return group;
  }

  async leaveGroup({ id, userId }: LeaveGroupParams) {
    const group = await this.isUserInGroup({ id, userId });
    if (group.owner.id === userId)
      throw new HttpException(
        'Cannot leave group as owner',
        HttpStatus.BAD_REQUEST,
      );
    group.users = group.users.filter((user) => user.id !== userId);
    return this.groupService.saveGroup(group);
  }

  async removeGroupRecipient(
    params: RemoveGroupRecipientParams,
  ): Promise<RemoveGroupUserResponse> {
    const { issuerId, removeUserId, id } = params;
    const userToBeRemoved = await this.userService.findUser({
      id: removeUserId,
    });
    if (!userToBeRemoved) throw new UserNotFoundException();
    const group = await this.isUserInGroup({ id, userId: removeUserId });
    if (group.owner.id !== issuerId) throw new GroupOwnerTransferException();
    if (group.owner.id === removeUserId)
      throw new HttpException(
        'Cannot remove yourself as owner',
        HttpStatus.BAD_REQUEST,
      );
    group.users = group.users.filter((u) => u.id !== removeUserId);
    const savedGroup = await this.groupService.saveGroup(group);
    return { group: savedGroup, user: userToBeRemoved };
  }
}
