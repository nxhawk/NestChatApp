import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile, User, UserPresence } from '../utils/typeorm';
import { UsersController } from './controllers/users.controller';
import { UserService } from './services/users.service';
import { Services } from 'src/utils/constants';
import { UserProfileController } from './controllers/users-profile.controller';
import { UserProfileService } from './services/users-profile.service';
import { ImageStorageModule } from 'src/image-storage/image-storage.module';
import { UserPresenceController } from './controllers/user-presence.controller';
import { UserPresenceService } from './services/user-presence.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, UserPresence]),
    ImageStorageModule,
  ],
  controllers: [UsersController, UserProfileController, UserPresenceController],
  providers: [
    {
      provide: Services.USERS,
      useClass: UserService,
    },
    {
      provide: Services.USERS_PROFILES,
      useClass: UserProfileService,
    },
    {
      provide: Services.USER_PRESENCE,
      useClass: UserPresenceService,
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
    {
      provide: Services.USER_PRESENCE,
      useClass: UserPresenceService,
    },
  ],
})
export class UsersModule {}
