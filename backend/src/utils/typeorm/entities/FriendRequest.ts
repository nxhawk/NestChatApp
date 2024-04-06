import { FriendRequestStatus } from 'src/utils/types';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'friend_request' })
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn()
  createdAt: Timestamp;

  @Column()
  status: FriendRequestStatus;

  // relationship
  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  sender: User;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  receiver: User;
}
