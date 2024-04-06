import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'friends' })
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Timestamp;

  // relationship
  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  sender: User;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  receiver: User;
}
