import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { Group, GroupMessage } from 'src/utils/typeorm';
import { Repository } from 'typeorm';
import { IGroupService } from '../interfaces/group';
import { IMessageAttachmentsService } from 'src/message-attachments/message-attachments';
import { IGroupMessageService } from '../interfaces/group-messages';
import { CreateGroupMessageParams } from 'src/utils/types';
import { GroupNotFoundException } from '../exceptions/GroupNotFound';
import { NotInGroupException } from '../exceptions/NotInGroup';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class GroupMessageService implements IGroupMessageService {
  constructor(
    @InjectRepository(GroupMessage)
    private readonly groupMessageRepository: Repository<GroupMessage>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @Inject(Services.GROUPS)
    private readonly groupService: IGroupService,
    @Inject(Services.MESSAGE_ATTACHMENTS)
    private readonly messageAttachmentsService: IMessageAttachmentsService,
  ) {}

  async createGroupMessage({
    groupId: id,
    ...params
  }: CreateGroupMessageParams) {
    const { content, author } = params;
    const group = await this.groupService.findGroupById(id);
    if (!group) throw new GroupNotFoundException();
    const findUser = group.users.find((u) => u.id === author.id);
    if (!findUser) throw new NotInGroupException();
    const groupMessage = this.groupMessageRepository.create({
      content,
      group,
      author: instanceToPlain(author),
      attachments: params.attachments
        ? await this.messageAttachmentsService.create(params.attachments)
        : [],
    });
    const savedMessage = await this.groupMessageRepository.save(groupMessage);
    group.lastMessageSent = savedMessage;
    const updatedGroup = await this.groupService.saveGroup(group);
    return { message: savedMessage, group: updatedGroup };
  }
}
