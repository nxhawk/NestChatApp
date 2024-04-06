import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export enum Routes {
  AUTH = 'auth',
  USERS = 'users',
  USERS_PROFILE = 'users/profile',
  USER_PRESENCE = 'users/presence',
  FRIENDS = 'friends',
  FRIEND_REQUESTS = 'friends/requests',
}

export enum Services {
  AUTH = 'AUTH_SERVICE',
  USERS = 'USERS_SERVICE',
  USERS_PROFILES = 'USERS_PROFILES_SERVICE',
  USER_PRESENCE = 'USER_PRESENCE_SERVICE',
  SPACES_CLIENT = 'SPACES_CLIENT',
  IMAGE_UPLOAD_SERVICE = 'IMAGE_UPLOAD_SERVICE',
  CLOUDINARY_SERVICE = 'CLOUDINARY_SERVICE',
  FRIENDS_SERVICE = 'FRIENDS_SERVICE',
  FRIENDS_REQUESTS_SERVICE = 'FRIEND_REQUEST_SERVICE',
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
