import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { diskStorage } from 'multer';
import { join } from 'path';

import { BrandsModule } from './modules/brands/brands.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ColorsModule } from './modules/colors/colors.module';
import { ProductsModule } from './modules/products/products.module';
import { SizesModule } from './modules/sizes/sizes.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads'
    }),
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: '/uploads',
      storage: diskStorage({
        destination: './uploads'
      })
    }),
    UsersModule,
    BrandsModule,
    ColorsModule,
    SizesModule,
    CategoriesModule,
    ProductsModule
  ]
})
export class AppModule {}
