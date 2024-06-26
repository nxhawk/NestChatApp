import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GroupMessage } from './GroupMessage';
import { User } from './User';

@Entity({ name: 'groups' })
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  avatar?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: number;

  @UpdateDateColumn({ name: 'updated_at' })
  lastMessageSentAt: Date;

  //relationship

  @ManyToMany(() => User, (user) => user.groups)
  @JoinTable()
  users: User[];

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  creator: User;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  owner: User;

  // messages
  @OneToMany(() => GroupMessage, (message) => message.group, {
    cascade: ['insert', 'remove', 'update'],
  })
  @JoinColumn()
  messages: GroupMessage[];

  @OneToOne(() => GroupMessage)
  @JoinColumn({ name: 'last_message_sent' })
  lastMessageSent: GroupMessage;
}
