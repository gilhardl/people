import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as moment from 'moment';

import * as uuid from 'uuid/v1';
import * as uuidTime from 'uuid-time';
import * as crypto from 'crypto';

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
    const hashPass = crypto
      .createHash('md5')
      .update(pass)
      .digest('hex');

    if (user && user.confirmed && user.password === hashPass) {
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

  async initiateConfirmation(token: string) {
    const tokenDate = moment(uuidTime.v1(token));
    const limitDate = moment().subtract(1, 'hour');
    if (tokenDate.isBefore(limitDate)) {
      return false;
    }

    const user = await this.usersService.findOneByConfirmationToken(token);
    return user ? true : false;
  }

  async confirm(token: string, pass: string) {
    let user: User = await this.usersService.findOneByConfirmationToken(token);
    if (!user) {
      return null;
    }

    user.password = crypto
      .createHash('md5')
      .update(pass)
      .digest('hex');
    user.confirmationToken = '';
    user.confirmed = true;

    user = await this.usersService.confirm(user);
    const { password, confirmationToken, recoverToken, ...result } = user;
    return result;
  }
}
