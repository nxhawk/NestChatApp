import { Controller, Get, Inject } from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { IUserService } from '../interfaces/user';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(Services.USERS)
    private readonly userService: IUserService,
  ) {}
}
