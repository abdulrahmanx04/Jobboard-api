import { BadRequestException, Injectable } from '@nestjs/common';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { error } from 'console';
@Injectable()
export class CloudinaryService {
   private allowedExtensions = ['.png', '.jpg', '.webp', '.jpeg', '.pdf', '.mp4', '.mov']

    private allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'video/mp4',
        'video/quicktime',     
        'application/pdf',
    ];
    private MAX_IMAGE_SIZE= 5 * 1024 * 1024
    private readonly MAX_DOC_SIZE= 100 * 1024 * 1024

    async uploadFile(file: Express.Multer.File, folder: string): Promise<UploadApiResponse> {
      if(!file) {
        throw new BadRequestException('No file uploaded')
      }
      if(file.size === 0) {
        throw new BadRequestException('File is empty')
      }

      if(!this.allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
        `Invalid file mimetype. Allowed: ${this.allowedMimeTypes.join(', ')}`,
       );
      }

      const ext= path.extname(file.originalname).toLocaleLowerCase()
      if(!this.allowedExtensions.includes(ext)) {
        throw new BadRequestException(
        `Invalid extension. Allowed: ${this.allowedExtensions.join(', ')}`,
        );
      }
      const isImage= file.mimetype.startsWith('image/') 
      const isVideo= file.mimetype.startsWith('video/')

     
      const maxSize= isImage ?
      this.MAX_IMAGE_SIZE
      : this.MAX_DOC_SIZE
      if(file.size > maxSize) {
        throw new BadRequestException(`File size cannot exceed ${maxSize / (1024 * 1024)}MB`);
      }

      const resource_type: 'image' | 'video' | 'raw' = 
      isImage ? 'image' : isVideo ? 'video' : 'raw'
      
      return new Promise((resolve,reject) => {
        cloudinary.uploader.upload_stream({folder,resource_type}, (error,result) => {
            if(error) reject(error)
            resolve(result as UploadApiResponse)     
        }).end(file.buffer)
      })
    }

    async deleteFile(publicId: string) {
        const result=await cloudinary.uploader.destroy(publicId)
        if(result.result !== 'ok') {
            throw new BadRequestException(`File delete failed: ${result.result}`);
        }
    }
}
