import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile, User } from '../utils/typeorm';
import { UsersController } from './controllers/users.controller';
import { UserService } from './services/users.service';
import { Services } from 'src/utils/constants';
import { UserProfileController } from './controllers/users-profile.controller';
import { UserProfileService } from './services/users-profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [UsersController, UserProfileController],
  providers: [
    {
      provide: Services.USERS,
      useClass: UserService,
    },
    {
      provide: Services.USERS_PROFILES,
      useClass: UserProfileService,
    },
  ],
  exports: [
    {
      provide: Services.USERS,
      useClass: UserService,
    },
    {
      provide: Services.USERS_PROFILES,
      useClass: UserProfileService,
    },
  ],
})
export class UsersModule {}
