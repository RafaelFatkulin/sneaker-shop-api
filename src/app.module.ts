import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';

import { BrandsModule } from './modules/brands/brands.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ColorsModule } from './modules/colors/colors.module';
import { ProductsModule } from './modules/products/products.module';
import { SizesModule } from './modules/sizes/sizes.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
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
