import {
  Controller,
  Inject,
  Patch,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Routes, Services, UserProfileFileFields } from 'src/utils/constants';
import { IUserProfile } from '../interfaces/user-profile';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserProfileFiles } from 'src/utils/types';

@Controller(Routes.USERS_PROFILE)
export class UserProfileController {
  constructor(
    @Inject(Services.USERS_PROFILES)
    private readonly userProfileService: IUserProfile,
  ) {}

  @Patch()
  @UseInterceptors(FileFieldsInterceptor(UserProfileFileFields))
  async updateUserProfile(
    @UploadedFiles()
    files: UserProfileFiles,
  ) {
    return 'hello';
  }
}
