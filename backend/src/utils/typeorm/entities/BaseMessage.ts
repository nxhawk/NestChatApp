import {
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { User } from './User';

export abstract class BaseMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Timestamp;

  @ManyToOne(() => User, (user) => user.messages)
  author: User;
}
