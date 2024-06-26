// import { GroupMessageAttachment, MessageAttachment } from '../utils/typeorm';
import { MessageAttachment } from 'src/utils/typeorm';
import {
  UploadImageParams,
  UploadMessageAttachmentParams,
} from '../utils/types';

export interface IImageStorageService {
  upload(params: UploadImageParams);
  uploadMessageAttachment(
    params: UploadMessageAttachmentParams,
  ): Promise<MessageAttachment>;
  // uploadGroupMessageAttachment(
  //   params: UploadGroupMessageAttachmentParams,
  // ): Promise<GroupMessageAttachment>;
}
