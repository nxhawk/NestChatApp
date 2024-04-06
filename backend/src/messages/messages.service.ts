import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IConversationsService } from 'src/conversations/conversations';
import { IFriendsService } from 'src/friends/friends';
import { Services } from 'src/utils/constants';
import { Message } from 'src/utils/typeorm';
import { Repository } from 'typeorm';
import { IMessageService } from './messages';
import {
  CreateMessageParams,
  CreateMessageResponse,
  DeleteMessageParams,
  EditMessageParams,
} from 'src/utils/types';
import { ConversationNotFoundException } from 'src/conversations/exceptions/ConversationNotFound';
import { FriendNotFoundException } from 'src/friends/exceptions/FriendNotFound';
import { CannotCreateMessageException } from './dtos/CannotCreateMessage';
import { instanceToPlain } from 'class-transformer';
import { IMessageAttachmentsService } from 'src/message-attachments/message-attachments';

@Injectable()
export class MessagesService implements IMessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationsService,
    @Inject(Services.MESSAGE_ATTACHMENTS)
    private readonly messageAttachmentsService: IMessageAttachmentsService,
    @Inject(Services.FRIENDS_SERVICE)
    private readonly friendsService: IFriendsService,
  ) {}

  async createMessage(
    params: CreateMessageParams,
  ): Promise<CreateMessageResponse> {
    const { user, content, id } = params;
    const conversation = await this.conversationService.findById(id);
    if (!conversation) throw new ConversationNotFoundException();
    const { creator, recipient } = conversation;
    if (creator.id !== user.id && recipient.id !== user.id)
      throw new CannotCreateMessageException();
    const isFriends = await this.friendsService.isFriends(
      creator.id,
      recipient.id,
    );
    if (!isFriends) throw new FriendNotFoundException();
    const message = await this.messageRepository.create({
      content,
      conversation,
      author: instanceToPlain(user),
      attachments: params.attachments
        ? await this.messageAttachmentsService.create(params.attachments)
        : [],
    });
    const savedMessage = await this.messageRepository.save(message);
    conversation.lastMessageSent = savedMessage;
    const updated = await this.conversationService.save(conversation);
    return { message: savedMessage, conversation: updated };
  }

  getMessages(id: number): Promise<Message[]> {
    throw new Error('Method not implemented.');
  }
  deleteMessage(params: DeleteMessageParams) {
    throw new Error('Method not implemented.');
  }
  editMessage(params: EditMessageParams): Promise<Message> {
    throw new Error('Method not implemented.');
  }


}
