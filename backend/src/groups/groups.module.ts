import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageStorageModule } from 'src/image-storage/image-storage.module';
import { MessageAttachmentsModule } from 'src/message-attachments/message-attachments.module';
import { UsersModule } from 'src/users/users.module';
import { Group, GroupMessage } from 'src/utils/typeorm';
import { GroupController } from './controllers/group.controller';
import { Services } from 'src/utils/constants';
import { GroupService } from './services/group.service';
import { isAuthorized } from 'src/utils/helpers';
import { GroupMiddleware } from './middlewares/group.middleware';
import { GroupMessageController } from './controllers/group-messages.controller';
import { GroupMessageService } from './services/group-messages.service';
import { GroupRecipientsController } from './controllers/group-recipients.controller';
import { GroupRecipientService } from './services/group-recipient.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, GroupMessage]),
    UsersModule,
    MessageAttachmentsModule,
    ImageStorageModule,
  ],
  controllers: [
    GroupController,
    GroupMessageController,
    GroupRecipientsController,
  ],
  providers: [
    {
      provide: Services.GROUPS,
      useClass: GroupService,
    },
    {
      provide: Services.GROUP_MESSAGES,
      useClass: GroupMessageService,
    },
    {
      provide: Services.GROUP_RECIPIENTS,
      useClass: GroupRecipientService,
    },
  ],
  exports: [
    {
      provide: Services.GROUPS,
      useClass: GroupService,
    },
  ],
})
export class GroupsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(isAuthorized, GroupMiddleware).forRoutes('groups/:id');
  }
}
