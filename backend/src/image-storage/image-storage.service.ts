import { Inject, Injectable } from '@nestjs/common';
import { IImageStorageService } from './image-storage';
import {
  UploadImageParams,
  UploadMessageAttachmentParams,
} from 'src/utils/types';
import { Services } from 'src/utils/constants';

@Injectable()
export class ImageStorageService implements IImageStorageService {
  constructor(
    @Inject(Services.CLOUDINARY_SERVICE) private readonly cloudinaryService,
  ) {}

  upload(params: UploadImageParams) {
    return this.cloudinaryService.uploadImage(params.file);
  }

  async uploadMessageAttachment(params: UploadMessageAttachmentParams) {
    console.log(params);
    return params.messageAttachment;
  }
}
