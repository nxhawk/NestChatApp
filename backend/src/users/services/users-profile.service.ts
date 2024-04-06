import { Injectable } from '@nestjs/common';
import { IUserProfile } from '../interfaces/user-profile';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile, User } from 'src/utils/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserProfileService implements IUserProfile {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  createProfile() {}
}
