import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BrandsModule } from './modules/brands/brands.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, BrandsModule]
})
export class AppModule {}
