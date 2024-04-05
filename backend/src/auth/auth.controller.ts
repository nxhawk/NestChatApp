import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  Res,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Routes, Services } from 'src/utils/constants';
import { instanceToPlain } from 'class-transformer';
import { IAuthService } from './auth';
import { IUserService } from 'src/users/interfaces/user';
import { Request, Response } from 'express';
import { AuthenticatedGuard, LocalAuthGuard } from './utils/Guards';

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

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Res() res: Response) {
    return res.send(HttpStatus.OK);
  }

  @Get('status')
  @UseGuards(AuthenticatedGuard)
  async status(@Req() req: Request, @Res() res: Response) {
    res.send(req.user);
  }
}
