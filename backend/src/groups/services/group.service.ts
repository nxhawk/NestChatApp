import { Inject, Injectable } from '@nestjs/common';
import { IGroupService } from '../interfaces/group';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/utils/typeorm';
import { Repository } from 'typeorm';
import { Services } from 'src/utils/constants';
import { IUserService } from 'src/users/interfaces/user';
import { IImageStorageService } from 'src/image-storage/image-storage';
import { CreateGroupParams, FetchGroupsParams } from 'src/utils/types';

@Injectable()
export class GroupService implements IGroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @Inject(Services.USERS)
    private readonly userService: IUserService,
    @Inject(Services.IMAGE_UPLOAD_SERVICE)
    private readonly imageStorageService: IImageStorageService,
  ) {}

  async createGroup(params: CreateGroupParams) {
    const { creator, title } = params;
    const userPromise = params.users.map((username) =>
      this.userService.findUser({ username }),
    );
    const users = (await Promise.all(userPromise)).filter((user) => user);
    users.push(creator);
    const groupParams = { owner: creator, users, creator, title };
    const group = this.groupRepository.create(groupParams);
    return await this.groupRepository.save(group);
  }

  getGroups(params: FetchGroupsParams): Promise<Group[]> {
    return this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.users', 'user')
      .where('user.id IN (:...users)', { users: [params.userId] })
      .leftJoinAndSelect('group.users', 'users')
      .leftJoinAndSelect('group.creator', 'creator')
      .leftJoinAndSelect('group.owner', 'owner')
      .leftJoinAndSelect('group.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('users.profile', 'usersProfile')
      .leftJoinAndSelect('users.presence', 'usersPresence')
      .orderBy('group.lastMessageSentAt', 'DESC')
      .getMany();
  }
}
