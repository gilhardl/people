import {
  Controller,
  Post,
  Request,
  UseGuards,
  Body,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

import { BANNED_EMAIL_DOMAINS } from './banned-email-domains';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  async signin(@Request() req) {
    return this.authService.signin(req.user);
  }

  @Post('register')
  async register(@Body() body: any) {
    // Todo : check body validation

    if (BANNED_EMAIL_DOMAINS.includes(body.email.split('@')[1])) {
      throw new HttpException('banned-email-domain', HttpStatus.BAD_REQUEST);
    }

    const emailAvailable = await this.usersService.isEmailAvailable(body.email);
    if (!emailAvailable) {
      throw new HttpException('email-not-available', HttpStatus.BAD_REQUEST);
    }

    const { user, token } = await this.authService.register(
      body.username,
      body.email,
      body.firstname,
      body.lastname
    );

    if (user === null) {
      throw new HttpException(
        'user-creation-error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    if (token === null) {
      throw new HttpException(
        'token-creation-error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const confirmUrl = body.confirmationUrl + '/' + token;
    console.log(confirmUrl);

    return true;
  }
}
