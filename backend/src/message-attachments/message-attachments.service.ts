import { Inject, Injectable } from '@nestjs/common';
import { IMessageAttachmentsService } from './message-attachments';
import { GroupMessageAttachment, MessageAttachment } from 'src/utils/typeorm';
import { Attachment } from 'src/utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Services } from 'src/utils/constants';
import { IImageStorageService } from 'src/image-storage/image-storage';

@Injectable()
export class MessageAttachmentsService implements IMessageAttachmentsService {
  constructor(
    @InjectRepository(MessageAttachment)
    private readonly attachmentRepository: Repository<MessageAttachment>,
    @InjectRepository(GroupMessageAttachment)
    private readonly groupAttachmentRepository: Repository<GroupMessageAttachment>,
    @Inject(Services.IMAGE_UPLOAD_SERVICE)
    private readonly imageUploadService: IImageStorageService,
  ) {}

  create(attachments: Attachment[]): Promise<MessageAttachment[]> {
    const promise = attachments.map(async (attachment) => {
      const newAttachment = this.attachmentRepository.create();
      const res = await this.imageUploadService.upload({
        key: attachment.destination,
        file: attachment,
      });
      newAttachment.url = res.url;
      const savedAttachment =
        await this.attachmentRepository.save(newAttachment);
      return savedAttachment;
    });
    return Promise.all(promise);
  }

  createGroupAttachments(
    attachments: Attachment[],
  ): Promise<GroupMessageAttachment[]> {
    const promise = attachments.map(async (attachment) => {
      const newAttachment = this.groupAttachmentRepository.create();
      const res = await this.imageUploadService.upload({
        key: attachment.destination,
        file: attachment,
      });
      newAttachment.url = res.url;
      const savedAttachment =
        await this.groupAttachmentRepository.save(newAttachment);
      return savedAttachment;
    });
    return Promise.all(promise);
  }

  deleteAllAttachments(attachments: MessageAttachment[]) {
    throw new Error('Method not implemented.');
  }
}
