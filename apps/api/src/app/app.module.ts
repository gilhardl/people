import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { environment } from '../environments/environment';

import { AppController } from './app.controller';
import { AppService } from './app.service';

const typeOrmOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: environment.db.host,
  port: environment.db.port,
  username: environment.db.username,
  password: environment.db.password,
  database: environment.db.database,
  synchronize: true,
  entities: []
};

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmOptions)],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
