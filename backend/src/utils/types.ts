import {
  Conversation,
  Friend,
  FriendRequest,
  Group,
  Message,
  MessageAttachment,
  User,
} from './typeorm';
import { Request } from 'express';

export type CreateUserDetails = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type ValidateUserDetails = {
  username: string;
  password: string;
};

export type FindUserParams = Partial<{
  id: number;
  email: string;
  username: string;
}>;

export type FindUserOptions = Partial<{
  selectAll: boolean;
}>;

export type UserProfileFiles = Partial<{
  banner: Express.Multer.File[];
  avatar: Express.Multer.File[];
}>;

export type UserPresenceStatus = 'online' | 'away' | 'offline' | 'dnd';

export type UpdateStatusMessageParams = {
  user: User;
  statusMessage: string;
};

export type UpdateUserProfileParams = Partial<{
  about: string;
  banner: Express.Multer.File;
  avatar: Express.Multer.File;
}>;

export type UploadImageParams = {
  key: string;
  file: Express.Multer.File;
};

export interface AuthenticatedRequest extends Request {
  user: User;
}

export type FriendRequestStatus = 'accepted' | 'pending' | 'rejected';

export type FriendRequestParams = {
  id: number;
  userId: number;
};

export type CreateFriendParams = {
  user: User;
  username: string;
};

export type AcceptFriendRequestResponse = {
  friend: Friend;
  friendRequest: FriendRequest;
};

export type DeleteFriendRequestParams = {
  id: number;
  userId: number;
};

export type CancelFriendRequestParams = {
  id: number;
  userId: number;
};

export type CreateConversationParams = {
  username: string;
  message: string;
};

export type UpdateConversationParams = Partial<{
  id: number;
  lastMessageSent: Message;
}>;

export type GetConversationMessagesParams = {
  id: number;
  limit: number;
};

export type FindMessageParams = {
  userId: number;
  conversationId: number;
  messageId: number;
};

export type AccessParams = {
  id: number;
  userId: number;
};

export interface Attachment extends Express.Multer.File {}

export type UploadMessageAttachmentParams = {
  file: Attachment;
  messageAttachment: MessageAttachment;
};

// export type UploadGroupMessageAttachmentParams = {
//   file: Attachment;
//   messageAttachment: GroupMessageAttachment;
// };

export type CreateMessageParams = {
  id: number;
  content?: string;
  attachments?: Attachment[];
  user: User;
};

export type CreateMessageResponse = {
  message: Message;
  conversation: Conversation;
};

export type DeleteMessageParams = {
  userId: number;
  conversationId: number;
  messageId: number;
};

export type EditMessageParams = {
  conversationId: number;
  messageId: number;
  userId: number;
  content: string;
};

export type CreateGroupParams = {
  creator: User;
  title?: string;
  users: string[];
};

export type FetchGroupsParams = {
  userId: number;
};

export type TransferOwnerParams = {
  userId: number;
  groupId: number;
  newOwnerId: number;
};

export type UpdateGroupDetailsParams = {
  id: number;
  title?: string;
  avatar?: Attachment;
};

export type CreateGroupMessageParams = {
  author: User;
  attachments?: Attachment[];
  content: string;
  groupId: number;
};

export type DeleteGroupMessageParams = {
  userId: number;
  groupId: number;
  messageId: number;
};

export type EditGroupMessageParams = {
  groupId: number;
  messageId: number;
  userId: number;
  content: string;
};

export type AddGroupRecipientParams = {
  id: number;
  username: string;
  userId: number;
};

export type AddGroupUserResponse = {
  group: Group;
  user: User;
};

export type LeaveGroupParams = {
  id: number;
  userId: number;
};

export type CheckUserGroupParams = {
  id: number;
  userId: number;
};
