import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as uuid from 'uuid/v4';

import { UsersEntity } from '@people/users';

import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<UsersEntity> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && user.password === pass) {
      const { password, confirmationToken, recoverToken, ...result } = user;
      return result;
    }
    return null;
  }

  async signin(user: UsersEntity) {
    const payload = { username: user.username, sub: user.id };
    return {
      jwt: this.jwtService.sign(payload),
      user: user
    };
  }

  async register(
    username: string,
    email: string,
    firstname: string,
    lastname: string
  ): Promise<{ user: User; token: string }> {
    const user: User = await this.usersService.register(
      username,
      email,
      firstname,
      lastname,
      uuid()
    );
    const { password, confirmationToken, recoverToken, ...result } = user;

    return {
      user: result,
      token: confirmationToken
    };
  }
}
