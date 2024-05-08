import { BadRequestException, Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join, normalize, sep } from 'path';

const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/;

@Controller('*')
export class AppController {
  @Get('uploads/:filename')
  async getFile(@Param('filename') filename: string, @Res() response: Response) {
    console.log(filename);

    const normalizedPath = normalize(filename);

    if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
      throw new BadRequestException('Malformed path');
    }

    const absolutePath = join(__dirname, '..', normalizedPath);
    return response.download(absolutePath);
  }
}
