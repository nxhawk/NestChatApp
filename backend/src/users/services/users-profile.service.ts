import { Inject, Injectable } from '@nestjs/common';
import { IUserProfile } from '../interfaces/user-profile';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile, User } from 'src/utils/typeorm';
import { Repository } from 'typeorm';
import { generateUUIDV4 } from 'src/utils/helpers';
import { UpdateUserProfileParams } from 'src/utils/types';
import { Services } from 'src/utils/constants';
import { IImageStorageService } from 'src/image-storage/image-storage';

@Injectable()
export class UserProfileService implements IUserProfile {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(Services.IMAGE_UPLOAD_SERVICE)
    private readonly imageStorageService: IImageStorageService,
  ) {}

  createProfile() {
    const newProfile = this.profileRepository.create();
    return this.profileRepository.save(newProfile);
  }

  async createProfileOrUpdate(user: User, params: UpdateUserProfileParams) {
    if (!user.profile) {
      user.profile = await this.createProfile();
    }
    return this.updateProfile(user, params);
  }

  async updateProfile(user: User, params: UpdateUserProfileParams) {
    if (params.avatar)
      user.profile.avatar = await this.updateAvatar(params.avatar);
    if (params.banner)
      user.profile.banner = await this.updateBanner(params.banner);
    if (params.about) user.profile.about = params.about;
    return this.userRepository.save(user);
  }

  async updateAvatar(file: Express.Multer.File) {
    const key = generateUUIDV4();
    const res = await this.imageStorageService.upload({ key, file });
    return res.url || res.public_id || key;
  }

  async updateBanner(file: Express.Multer.File) {
    const key = generateUUIDV4();
    const res = await this.imageStorageService.upload({ key, file });
    return res.url || res.public_id || key;
  }
}
