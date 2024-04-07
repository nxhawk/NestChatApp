import {
  Body,
  Controller,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Routes, Services } from 'src/utils/constants';
import { IGroupRecipientService } from '../interfaces/group-recipient';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { AddGroupRecipientDto } from '../dtos/AddGroupRecipient.dto';

@SkipThrottle()
@Controller(Routes.GROUP_RECIPIENTS)
export class GroupRecipientsController {
  constructor(
    @Inject(Services.GROUP_RECIPIENTS)
    private readonly groupRecipientService: IGroupRecipientService,
  ) {}

  @Post()
  async addGroupRecipient(
    @AuthUser() { id: userId }: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() { username }: AddGroupRecipientDto,
  ) {
    const params = { id, userId, username };
    const response = await this.groupRecipientService.addGroupRecipient(params);
    // socket here
    return response;
  }
}
