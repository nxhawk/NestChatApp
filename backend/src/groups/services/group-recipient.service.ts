import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IGroupRecipientService } from '../interfaces/group-recipient';
import { Services } from 'src/utils/constants';
import { IUserService } from 'src/users/interfaces/user';
import { IGroupService } from '../interfaces/group';
import { AddGroupRecipientParams, AddGroupUserResponse } from 'src/utils/types';
import { InvalidGroupException } from '../exceptions/InvalidGroup';
import { UserNotFoundException } from 'src/users/exceptions/UserNotFound';

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
}
