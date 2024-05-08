import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class SharpService {
  imageDir = './uploads';

  async createImage({
    type,
    title,
    image
  }: {
    type: string;
    title: string;
    image: Express.Multer.File;
  }): Promise<string> {
    try {
      const fileFolder = `${this.imageDir}/${type}`;
      const filePath = path.join(fileFolder, `${title}-${Date.now()}.webp`);

      await this.createDirectory(fileFolder);

      await this.convertImage(image, filePath);

      return `http://localhost:8000/${filePath}`;
    } catch (error) {
      Logger.error('Error during image processing:', error);
      throw new Error('Failed to process image');
    }
  }

  async updateImage({
    type,
    title,
    oldImage,
    image
  }: {
    type: string;
    title: string;
    oldImage?: string;
    image?: Express.Multer.File;
  }): Promise<string> {
    try {
      const fileFolder = `${this.imageDir}/${type}`;
      const filePath = path.join(fileFolder, `${title}-${Date.now()}.webp`);

      await this.createDirectory(fileFolder);

      if (oldImage) {
        await this.deleteImage(oldImage);
      }

      await this.convertImage(image, filePath);

      return filePath;
    } catch (error) {
      Logger.error('Error during image processing:', error);
      throw new Error('Failed to process image');
    }
  }

  async deleteImage(filePath: string) {
    try {
      await fs.promises.access(filePath).then(async () => {
        return fs.promises.unlink(filePath);
      });
    } catch (error) {
      Logger.error('Error deleting image:', error);
    }
  }

  private async createDirectory(directory: string): Promise<void> {
    await fs.promises.access(directory).catch(async () => {
      await fs.promises.mkdir(directory, {
        recursive: true
      });
    });
  }

  private async convertImage(image: Express.Multer.File, filePath: string): Promise<void> {
    await sharp(image.buffer)
      .resize(1920, 1080)
      .webp({
        quality: 70,
        lossless: true,
        nearLossless: false,
        smartSubsample: false,
        loop: 0,
        force: true,
        effort: 3
      })
      .toFile(filePath);
  }
}
