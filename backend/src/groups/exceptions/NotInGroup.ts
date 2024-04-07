import { HttpException, HttpStatus } from '@nestjs/common';

export class NotInGroupException extends HttpException {
  constructor() {
    super('User not in this group', HttpStatus.BAD_REQUEST);
  }
}
