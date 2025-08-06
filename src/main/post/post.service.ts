import { Injectable } from '@nestjs/common';
import { TJwtPayload } from 'src/types/user';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PostService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  async createPost(
    content: string,
    file: Express.Multer.File,
    loginUser: TJwtPayload,
  ) {
    let imageUrl: string | null = null;
    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);
      console.log(result);
    }
  }
}
