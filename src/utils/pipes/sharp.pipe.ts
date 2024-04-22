import type { PipeTransform } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class SharpPipe implements PipeTransform<Express.Multer.File, Promise<string>> {
  dirName: string;

  fileName: string;

  constructor(dirName: string, fileName: string) {
    this.dirName = dirName;
    this.fileName = fileName;
  }

  async transform(image: Express.Multer.File): Promise<string> {
    const fileName = `${this.fileName}-${Date.now()}.webp`;
    const filePath = path.join(`./uploads/${this.dirName}`, fileName);

    try {
      await fs.promises.mkdir(path.dirname(filePath), {
        recursive: true
      });

      await sharp(image.buffer).resize(1920, 1080).webp({ effort: 3 }).toFile(filePath);
      return filePath;
    } catch (error) {
      // Handle errors here
      console.error('Error during image processing:', error);
      throw new Error('Failed to process image');
    }
  }
}
