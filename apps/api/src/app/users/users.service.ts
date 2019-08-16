import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, Equal } from 'typeorm';

import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { User } from '../entities/user.entity';

import { UsersEntity } from '@people/users';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(@InjectRepository(User) repo: Repository<User>) {
    super(repo);
  }

  async findOneByUsername(username: string): Promise<UsersEntity> {
    const users: UsersEntity[] = await this.repo.find({
      username: Equal(username)
    });
    return users.length > 0 ? users[0] : null;
  }

  async findOneByConfirmationToken(token: string): Promise<User> {
    const users: User[] = await this.repo.find({
      confirmationToken: Equal(token)
    });
    return users.length > 0 ? users[0] : null;
  }

  async register(
    username: string,
    email: string,
    firstname: string,
    lastname: string,
    confirmationToken: string
  ): Promise<User> {
    const user = this.repo.create({
      username: username,
      password: '',
      role: 'administrator',
      firstname: firstname,
      lastname: lastname,
      phone: '',
      email: email,
      job: '',
      confirmationToken: confirmationToken
    });
    return this.repo.save(user);
  }

  async isEmailAvailable(email: string) {
    const users: UsersEntity[] = await this.repo
      .createQueryBuilder('user')
      .where('user.username = :username or user.username like :domain', {
        username: email,
        domain: '%@' + email.split('@')[1]
      })
      .execute();
    return users.length > 0 ? false : true;
  }

  async confirm(user: User): Promise<User> {
    return this.repo.save(user);
  }
}
