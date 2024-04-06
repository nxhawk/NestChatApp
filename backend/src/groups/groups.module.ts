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

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, GroupMessage]),
    UsersModule,
    MessageAttachmentsModule,
    ImageStorageModule,
  ],
  controllers: [GroupController],
  providers: [
    {
      provide: Services.GROUPS,
      useClass: GroupService,
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
