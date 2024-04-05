import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { IUserService } from 'src/users/interfaces/user';
import { ValidateUserDetails } from 'src/utils/types';
import { compareHash } from 'src/utils/helpers';

@Injectable()
export class AuthService {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUserService,
  ) {}

  async validateUser(userDetails: ValidateUserDetails): Promise<any> {
    const user = await this.userService.findUser(
      { username: userDetails.username },
      { selectAll: true },
    );
    console.log(user);
    if (!user)
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    const isPasswordValid = await compareHash(
      userDetails.password,
      user.password,
    );
    return isPasswordValid ? user : null;
  }
}
