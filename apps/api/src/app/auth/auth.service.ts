import { Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';

import { UsersEntity } from '@people/users';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<UsersEntity> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
