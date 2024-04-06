import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export enum Routes {
  AUTH = 'auth',
  USERS = 'users',
  USERS_PROFILE = 'users/profile',
}

export enum Services {
  AUTH = 'AUTH_SERVICE',
  USERS = 'USERS_SERVICE',
  USERS_PROFILES = 'USERS_PROFILES_SERVICE',
}

export const UserProfileFileFields: MulterField[] = [
  {
    name: 'banner',
    maxCount: 1,
  },
  {
    name: 'avatar',
    maxCount: 1,
  },
];
