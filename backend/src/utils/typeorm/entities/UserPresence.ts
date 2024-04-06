import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity({ name: 'user_presence' })
export class UserPresence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  statusMessage?: string;

  @Column({ default: false })
  showOffline: boolean;

  // relationship
  // one user has one presence (one to one)
  @OneToOne(() => User, (user) => user.presence)
  user: User;
}
