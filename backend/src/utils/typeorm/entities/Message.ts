import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseMessage } from './BaseMessage';
import { Conversation } from './Conversation';
import { MessageAttachment } from './MessageAttachment';

@Entity({ name: 'message' })
export class Message extends BaseMessage {
  @ManyToOne(() => Conversation, (con) => con.messages)
  conversation: Conversation;

  @OneToMany(() => MessageAttachment, (attachment) => attachment.message)
  @JoinColumn()
  attachments: MessageAttachment[];
}
