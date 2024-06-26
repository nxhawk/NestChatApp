import { UpdateUserProfileParams } from 'src/utils/types';
import { User } from '../../utils/typeorm';

export interface IUserProfile {
  createProfile();
  updateProfile(user: User, params: UpdateUserProfileParams);
  createProfileOrUpdate(user: User, params: UpdateUserProfileParams);
}
