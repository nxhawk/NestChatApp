import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './Profile';
import { UserPresence } from './UserPresence';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  // relationship
  // one user has one profile (one to one)
  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn()
  profile: Profile;

  // one user has one presence (one to one)
  @OneToOne(() => UserPresence, (up) => up.user, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn()
  presence: UserPresence;
}
