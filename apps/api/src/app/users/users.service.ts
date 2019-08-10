import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, Equal } from 'typeorm';

import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { User } from '../entities/user.entity';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(@InjectRepository(User) repo: Repository<User>) {
    super(repo);
  }

  async findOneByUsername(username: string) {
    const users: User[] = await this.repo.find({
      username: Equal(username)
    });
    return users.length > 0 ? users[0] : null;
  }
}
