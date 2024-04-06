import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Query,
} from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { IUserService } from '../interfaces/user';
import { UserAlreadyExists } from '../exceptions/UserAlreadyExists';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(Services.USERS)
    private readonly userService: IUserService,
  ) {}

  @Get('search')
  searchUser(@Query('query') query: string) {
    if (!query)
      throw new HttpException('Provide a valid query', HttpStatus.BAD_REQUEST);
    return this.userService.searchUsers(query);
  }

  @Get('check')
  async checkUsername(@Query('username') username: string) {
    if (!username)
      throw new HttpException(
        'Provide a valid username',
        HttpStatus.BAD_REQUEST,
      );
    const user = await this.userService.findUser({ username });
    if (user) throw new UserAlreadyExists();
    return HttpStatus.OK;
  }
}
