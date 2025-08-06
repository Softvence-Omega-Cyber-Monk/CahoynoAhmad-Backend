import { Global, Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import cloudinary from './cloudinary.config';

@Global()
@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'apollo_digital' }, (error, result) => {
          if (error) return reject(error);
          return resolve(result!);
        })
        .end(file.buffer);
    });
  }
}
