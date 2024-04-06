import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from 'src/utils/typeorm';
import { Services } from 'src/utils/constants';

@Module({
  imports: [TypeOrmModule.forFeature([Friend])],
  providers: [
    {
      provide: Services.FRIENDS_SERVICE,
      useClass: FriendsService,
    },
  ],
  controllers: [FriendsController],
  exports: [
    {
      provide: Services.FRIENDS_SERVICE,
      useClass: FriendsService,
    },
  ],
})
export class FriendsModule {}
