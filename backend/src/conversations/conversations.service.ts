import { Inject, Injectable } from '@nestjs/common';
import { IConversationsService } from './conversations';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation, Message, User } from 'src/utils/typeorm';
import { Repository } from 'typeorm';
import { Services } from 'src/utils/constants';
import { IUserService } from 'src/users/interfaces/user';
import { IFriendsService } from 'src/friends/friends';
import { CreateConversationParams } from 'src/utils/types';
import { UserNotFoundException } from 'src/users/exceptions/UserNotFound';
import { CreateConversationException } from './exceptions/CreateConversation';
import { FriendNotFoundException } from 'src/friends/exceptions/FriendNotFound';
import { ConversationExistsException } from './exceptions/ConversationExists';

@Injectable()
export class ConversationsService implements IConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject(Services.USERS)
    private readonly userService: IUserService,
    @Inject(Services.FRIENDS_SERVICE)
    private readonly friendsService: IFriendsService,
  ) {}

  async createConversation(creator: User, params: CreateConversationParams) {
    const { username, message: content } = params;
    const recipient = await this.userService.findUser({ username });
    if (!recipient) throw new UserNotFoundException();
    if (creator.id === recipient.id)
      throw new CreateConversationException(
        'Cannot create Conversation with yourself',
      );
    const isFriends = await this.friendsService.isFriends(
      creator.id,
      recipient.id,
    );
    if (!isFriends) throw new FriendNotFoundException();
    const exists = await this.isCreated(creator.id, recipient.id);
    if (exists) throw new ConversationExistsException();
    const newConversation = this.conversationRepository.create({
      creator,
      recipient,
    });
    const conversation =
      await this.conversationRepository.save(newConversation);
    const newMessage = this.messageRepository.create({
      content,
      conversation,
      author: creator,
    });
    await this.messageRepository.save(newMessage);
    return conversation;
  }

  async isCreated(userId: number, recipientId: number) {
    return this.conversationRepository.findOne({
      where: [
        {
          creator: { id: userId },
          recipient: { id: recipientId },
        },
        {
          creator: { id: recipientId },
          recipient: { id: userId },
        },
      ],
    });
  }
}
