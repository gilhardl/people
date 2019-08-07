import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

const typeOrmOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'people',
  synchronize: true,
  entities: []
};

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmOptions)],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
