import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { IConversationsService } from '../conversations';
import { AuthenticatedRequest } from 'src/utils/types';
import { NextFunction, Response } from 'express';
import { InvalidConversationIdException } from '../exceptions/InvalidConversationId';
import { ConversationNotFoundException } from '../exceptions/ConversationNotFound';

// check user can access this conversation (creator or recipient)
@Injectable()
export class ConversationMiddleware implements NestMiddleware {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationsService,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { id: userId } = req.user;
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new InvalidConversationIdException();
    const isReadable = await this.conversationService.hasAccess({ id, userId });
    if (isReadable) next();
    else throw new ConversationNotFoundException();
  }
}
