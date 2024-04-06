import { Conversation } from './entities/Conversation';
import { Friend } from './entities/Friend';
import { FriendRequest } from './entities/FriendRequest';
import { Message } from './entities/Message';
import { MessageAttachment } from './entities/MessageAttachment';
import { Profile } from './entities/Profile';
import { User } from './entities/User';
import { UserPresence } from './entities/UserPresence';

const entities = [
  User,
  Profile,
  UserPresence,
  FriendRequest,
  Friend,
  Conversation,
  Message,
  MessageAttachment,
];

export default entities;
export {
  User,
  Profile,
  UserPresence,
  FriendRequest,
  Friend,
  Conversation,
  Message,
  MessageAttachment,
};
