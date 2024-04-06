import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IConversationsService } from 'src/conversations/conversations';
import { IFriendsService } from 'src/friends/friends';
import { Services } from 'src/utils/constants';
import { Conversation, Message } from 'src/utils/typeorm';
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
import { CannotCreateMessageException } from './exceptions/CannotCreateMessage';
import { instanceToPlain } from 'class-transformer';
import { IMessageAttachmentsService } from 'src/message-attachments/message-attachments';
import { buildFindMessageParams } from 'src/utils/builders';
import { CannotDeleteMessage } from './exceptions/CannotDeleteMessage';

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

  getMessages(conversationId: number): Promise<Message[]> {
    return this.messageRepository.find({
      relations: ['author', 'attachments', 'author.profile'],
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteMessage(params: DeleteMessageParams) {
    const { conversationId } = params;
    const msgParams = { id: conversationId, limit: 10 };
    const conversation = await this.conversationService.getMessages(msgParams);
    if (!conversation) throw new ConversationNotFoundException();
    const findMessageParams = buildFindMessageParams(params);
    const message = await this.messageRepository.findOne({
      where: findMessageParams,
    });
    if (!message) throw new CannotDeleteMessage();
    if (conversation.lastMessageSent.id !== message.id)
      return this.messageRepository.delete({ id: message.id });
    return this.deleteLastMessage(conversation, message);
  }

  async deleteLastMessage(conversation: Conversation, message: Message) {
    const size = conversation.messages.length;
    const SECOND_MESSAGE_INDEX = 1;
    if (size <= 1) {
      console.log('Last Message Sent is deleted');
      await this.conversationService.update({
        id: conversation.id,
        lastMessageSent: null,
      });
    } else {
      console.log('There are more than 1 message');
      const newLastMessage = conversation.messages[SECOND_MESSAGE_INDEX];
      await this.conversationService.update({
        id: conversation.id,
        lastMessageSent: newLastMessage,
      });
    }
    return this.messageRepository.delete({ id: message.id });
  }

  async editMessage(params: EditMessageParams): Promise<Message> {
    const messageDB = await this.messageRepository.findOne({
      where: {
        id: params.messageId,
        author: { id: params.userId },
      },
      relations: [
        'conversation',
        'conversation.creator',
        'conversation.recipient',
        'author',
        'author.profile',
      ],
    });
    if (!messageDB)
      throw new HttpException('Cannot Edit Message', HttpStatus.BAD_REQUEST);
    if (messageDB.conversation.id != params.conversationId)
      throw new HttpException('Cannot Edit Message', HttpStatus.BAD_REQUEST);
    messageDB.content = params.content;
    return this.messageRepository.save(messageDB);
  }
}
