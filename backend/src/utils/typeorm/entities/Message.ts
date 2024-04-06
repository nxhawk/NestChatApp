import { Entity, ManyToOne } from 'typeorm';
import { BaseMessage } from './BaseMessage';
import { Conversation } from './Conversation';

@Entity({ name: 'message' })
export class Message extends BaseMessage {
  @ManyToOne(() => Conversation, (con) => con.messages)
  conversation: Conversation;
}
