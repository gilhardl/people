import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { environment } from '../environments/environment';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { UsersModule } from './users/users.module';




const typeOrmOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: environment.db.host,
  port: environment.db.port,
  username: environment.db.username,
  password: environment.db.password,
  database: environment.db.database,
  synchronize: true,
  entities: [User]
};

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmOptions), UsersModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
