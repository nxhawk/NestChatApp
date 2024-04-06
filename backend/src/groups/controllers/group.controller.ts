import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Routes, Services } from 'src/utils/constants';
import { IGroupService } from '../interfaces/group';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { CreateGroupDto } from '../dtos/CreateGroup.dto';

@SkipThrottle()
@Controller(Routes.GROUPS)
export class GroupController {
  constructor(
    @Inject(Services.GROUPS) private readonly groupService: IGroupService,
  ) {}

  @Post()
  async createGroup(@AuthUser() user: User, @Body() payload: CreateGroupDto) {
    const group = await this.groupService.createGroup({
      ...payload,
      creator: user,
    });
    // socket here
    return group;
  }

  @Get()
  getGroups(@AuthUser() user: User) {
    return this.groupService.getGroups({ userId: user.id });
  }
}
