import {
  Body,
  Controller,
  Inject,
  Patch,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Routes, Services, UserProfileFileFields } from 'src/utils/constants';
import { IUserProfile } from '../interfaces/user-profile';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateUserProfileParams, UserProfileFiles } from 'src/utils/types';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { UpdateUserProfileDto } from '../dtos/UpdateUserProfile.dto';

@Controller(Routes.USERS_PROFILE)
export class UserProfileController {
  constructor(
    @Inject(Services.USERS_PROFILES)
    private readonly userProfileService: IUserProfile,
  ) {}

  @Patch()
  @UseInterceptors(FileFieldsInterceptor(UserProfileFileFields))
  async updateUserProfile(
    @AuthUser() user: User,
    @UploadedFiles()
    files: UserProfileFiles,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    const params: UpdateUserProfileParams = {};
    updateUserProfileDto.about && (params.about = updateUserProfileDto.about);
    files.banner && (params.banner = files.banner[0]);
    files.avatar && (params.avatar = files.avatar[0]);
    return this.userProfileService.createProfileOrUpdate(user, params);
  }
}
