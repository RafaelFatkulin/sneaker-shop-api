import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BrandsModule } from './modules/brands/brands.module';
import { ColorsModule } from './modules/colors/colors.module';
import { ProductsModule } from './modules/products/products.module';
import { SizesModule } from './modules/sizes/sizes.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    BrandsModule,
    ColorsModule,
    SizesModule,
    ProductsModule
  ]
})
export class AppModule {}
