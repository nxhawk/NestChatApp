import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Routes, Services } from 'src/utils/constants';
import { instanceToPlain } from 'class-transformer';
import { IAuthService } from './auth';
import { IUserService } from 'src/users/interfaces/user';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private readonly authService: IAuthService,
    @Inject(Services.USERS) private readonly userService: IUserService,
  ) {}

  @Post('register')
  async registerUser(@Body() createAuthDto: CreateAuthDto) {
    return instanceToPlain(await this.userService.createUser(createAuthDto));
  }
}
